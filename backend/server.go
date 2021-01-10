package backend

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/pat"

	"github.com/zingales/theresheep/gamelogic"
)

var games = new(sync.Map)

func StartServer(port string) {

	err := http.ListenAndServe(":8090", DefineRoutes())
	fmt.Println(err)
}

type JsonBody = map[string]interface{}
type HttpStatus = int

type ApiHandlerFunc func(
	http.ResponseWriter, *http.Request,
) (JsonBody, HttpStatus, error)

type GameApiHandlerFunc func(
	*gamelogic.Game, http.ResponseWriter, *http.Request,
) (JsonBody, HttpStatus, error)

type PlayerApiHandlerFunc func(
	*gamelogic.Player, *gamelogic.Game, http.ResponseWriter, *http.Request,
) (JsonBody, HttpStatus, error)

// allowCors is useful in development mode when react is being served from a
// webpack dev server on a different port than the backend. allowCors can
// (should?) be turned off in production
func allowCors(w http.ResponseWriter, r *http.Request) {
	origins := r.Header["Origin"]
	var origin string
	// try to avoid setting origin to * directly bc
	// chrome complains about setting origin to *
	// if request.credentials has been set to
	// 'include'
	// https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials
	if len(origins) > 0 {
		origin = origins[0]
	} else {
		origin = "*"
	}
	w.Header().Set("Access-Control-Allow-Origin", origin)
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	reqHeaders := r.Header["Access-Control-Request-Headers"]
	if len(reqHeaders) > 0 {
		w.Header().Set(
			"Access-Control-Allow-Headers",
			strings.Join(reqHeaders, ","))
	}
}

func WrapApiEndpoint(
	apiHandlerFunc ApiHandlerFunc,
) http.HandlerFunc {
	return func(responseWriter http.ResponseWriter, request *http.Request) {
		allowCors(responseWriter, request)

		body, status, err := apiHandlerFunc(responseWriter, request)
		responseWriter.WriteHeader(status)
		if body == nil {
			body = map[string]interface{}{}
		}

		if err != nil {
			if status >= 500 {
				log.Print(err)
			}

			body["error"] = err.Error()

		}

		json.NewEncoder(responseWriter).Encode(body)
	}
}

func WrapGameApiEndpoint(
	apiHandlerFunc GameApiHandlerFunc,
) http.HandlerFunc {
	return WrapApiEndpoint(func(
		responseWriter http.ResponseWriter, request *http.Request,
	) (JsonBody, HttpStatus, error) {

		_, gameId := getFirstOccuranceInUrlParam(request, ":gameId")
		var game *gamelogic.Game
		temp, ok := games.Load(gameId)
		if ok {
			game = temp.(*gamelogic.Game)
		} else {
			return nil, http.StatusBadRequest, GameNotFoundError
		}

		return apiHandlerFunc(game, responseWriter, request)
	})
}

func WrapPlayerApiEndpoint(
	apiHandlerFunc PlayerApiHandlerFunc,
) http.HandlerFunc {
	return WrapApiEndpoint(func(
		responseWriter http.ResponseWriter, request *http.Request,
	) (JsonBody, HttpStatus, error) {

		_, gameId := getFirstOccuranceInUrlParam(request, ":gameId")
		var game *gamelogic.Game
		temp, ok := games.Load(gameId)
		if ok {
			game = temp.(*gamelogic.Game)
		} else {
			return nil, http.StatusBadRequest, GameNotFoundError
		}
		_, playerIdAsString := getFirstOccuranceInUrlParam(request, ":playerId")
		playerId, err := strconv.Atoi(playerIdAsString)
		if err != nil {
			return nil, http.StatusBadRequest, err
		}

		player, err := game.GetPlayerById(playerId)
		if err != nil {
			return nil, http.StatusBadRequest, err
		}

		return apiHandlerFunc(player, game, responseWriter, request)
	})
}

// Errors
var InvalidMethodError error = errors.New(
	"This endpoint does not except that http method")
var GameNotFoundError error = errors.New("Game with that id was not found")
var NotImplementedError error = errors.New(
	"That method has not been implemented yet")
var MissingParamInUrlError error = errors.New(
	"Request Url was missing a param key")
var RoleNoteFoundError error = errors.New("This role does not exist")
var InvalidJSON error = errors.New("Invalid Json")

// Var Method Types:
const MethodGet = "GET"
const MethodPost = "POST"

func DefineRoutes() http.Handler {
	mux := pat.New()

	// Redirects

	mux.Put("/api/games/{gameId}/role_pool", WrapGameApiEndpoint(AssignRolePool))
	mux.Get("/api/games/{gameId}/role_pool", WrapGameApiEndpoint(GetRolePool))

	mux.Post("/api/games/{gameId}/start", WrapGameApiEndpoint(StartGame))

	mux.Get("/api/games/{gameId}/players/{playerId}/state",
		WrapPlayerApiEndpoint(GetGameStateForPlayer))
	mux.Post("/api/games/{gameId}/players", WrapGameApiEndpoint(CreatePlayer))

	mux.Post("/api/games/{gameId}/player/{playerId}/do_action",
		WrapPlayerApiEndpoint(DoAction))

	mux.Post("/api/games", WrapApiEndpoint(CreateGame))

	mux.PathPrefix("/").Methods(
		http.MethodOptions).HandlerFunc(AllowPreflight)

	return mux
}

func AllowPreflight(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "*")
}

func GetRolePool(
	game *gamelogic.Game, responseWriter http.ResponseWriter, request *http.Request,
) (JsonBody, HttpStatus, error) {

	// for x := range game.rolePool {

	// }

	return nil, http.StatusOK, nil
}

var roleCast = map[string]gamelogic.Role{
	"unassigned":   gamelogic.Unassigned,
	"villager":     gamelogic.Villager,
	"werewolf":     gamelogic.Werewolf,
	"seer":         gamelogic.Seer,
	"robber":       gamelogic.Robber,
	"troublemaker": gamelogic.TroubleMaker,
	"tanner":       gamelogic.Tanner,
	"drunk":        gamelogic.Drunk,
	"hunter":       gamelogic.Hunter,
	"mason":        gamelogic.Mason,
	"insomniac":    gamelogic.Insomniac,
	"minion":       gamelogic.Minion,
	"doppleganger": gamelogic.DoppleGanger,
}

func AssignRolePool(
	game *gamelogic.Game, responseWriter http.ResponseWriter,
	request *http.Request,
) (JsonBody, HttpStatus, error) {
	rolesReq := struct{ Roles []string }{}

	if err := json.NewDecoder(request.Body).Decode(&rolesReq); err != nil {
		return nil, http.StatusBadRequest, InvalidJSON
	}

	var roles []gamelogic.Role

	for _, roleName := range rolesReq.Roles {
		role, ok := gamelogic.RoleNameToID[roleName]
		if !ok {
			return nil, http.StatusBadRequest, RoleNoteFoundError
		}
		roles = append(roles, role)
	}

	game.AssignRolePool(roles)

	return nil, http.StatusOK, nil
}

func StartGame(
	game *gamelogic.Game, responseWriter http.ResponseWriter,
	request *http.Request,
) (JsonBody, HttpStatus, error) {

	if err := game.Start(); err != nil {
		return nil, http.StatusBadRequest, err
	}

	go func() {
		// TODO: thread a context through here
		game.ExecuteNight()

		// wait 3 seconds before starting day phase to allow people to
		// see their night information.
		// TODO: add a countdown so people
		// can see when the transition will happen, or add a continue
		// button and wait for everyone to press it before coninuing
		timer := time.NewTimer(3 * time.Second)
		<-timer.C

		game.ExecuteDay()

		game.EndGame()

	}()

	return nil, http.StatusOK, nil
}

func CreateGame(
	responseWriter http.ResponseWriter, request *http.Request,
) (JsonBody, HttpStatus, error) {
	name := "Game1"

	game, err := gamelogic.CreateGame(name)
	if err != nil {
		return nil, http.StatusInternalServerError, err
	}

	games.Store(name, game)

	body := map[string]interface{}{
		"id": game.Id,
	}

	return body, http.StatusOK, nil
}

func GetGameStateForPlayer(
	player *gamelogic.Player, game *gamelogic.Game,
	responseWriter http.ResponseWriter, request *http.Request,
) (JsonBody, HttpStatus, error) {
	body := map[string]interface{}{
		"allPlayers": game.PlayerNames(),
		"phase":      game.Phase,
		"player":     player,
	}

	// It should always be the case that both (game.Phase == "end" and
	// game.EndGameState != nil) or neither
	if game.Phase == "end" && game.EndGameState != nil {
		body["endgame"] = game.EndGameState
	}
	return body, http.StatusOK, nil
}

func getFirstOccuranceInUrlParam(
	request *http.Request, key string,
) (error, string) {
	keys, ok := request.URL.Query()[key]

	if !ok || len(keys[0]) < 1 {
		return MissingParamInUrlError, ""
	}

	return nil, keys[0]
}

func CreatePlayer(
	game *gamelogic.Game, responseWriter http.ResponseWriter,
	request *http.Request,
) (JsonBody, HttpStatus, error) {

	player := struct{ Name string }{}

	if err := json.NewDecoder(request.Body).Decode(&player); err != nil {
		return nil, http.StatusBadRequest, InvalidJSON
	}

	id, err := game.AddPlayer(
		gamelogic.CreatePlayer(
			player.Name,
			NewBrowserUserInput(),
		),
	)

	if err != nil {
		return nil, http.StatusBadRequest, err
	}

	body := map[string]interface{}{
		"id": id,
	}
	return body, http.StatusOK, nil
}

func DoAction(
	player *gamelogic.Player, _ *gamelogic.Game,
	w http.ResponseWriter, r *http.Request,
) (JsonBody, HttpStatus, error) {

	action := struct {
		ActionType string
		Action     interface{}
	}{}
	if err := json.NewDecoder(r.Body).Decode(&action); err != nil {
		return nil, http.StatusBadRequest, InvalidJSON
	}

	asFloat, isFloat := action.Action.(float64)
	if isFloat {
		// hack because go deserializes numbers to floats. Convert all
		// floats to ints so ReceiveMessage can work with ints
		action.Action = int(asFloat)
	}

	err := player.UserAction(action.ActionType, action.Action)
	if err != nil {
		return nil, http.StatusBadRequest, err
	}

	return nil, http.StatusOK, nil
}
