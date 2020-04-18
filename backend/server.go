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

	"github.com/gorilla/pat"

	"github.com/zingales/theresheep/gamelogic"
)

var games = new(sync.Map)

func StartServer(port string) {

	http.ListenAndServe(":8090", DefineRoutes())
}

type ApiHandlerFunc func(http.ResponseWriter, *http.Request) (error, int)
type GameApiHandlerFunc func(*gamelogic.Game, http.ResponseWriter, *http.Request) (error, int)
type PlayerApiHandlerFunc func(*gamelogic.Player, *gamelogic.Game, http.ResponseWriter, *http.Request) (error, int)

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

		var httpStatus int
		if err, httpStatus := apiHandlerFunc(responseWriter, request); err != nil {
			if httpStatus >= 500 {
				log.Print(err)
			}
			http.Error(responseWriter, err.Error(), httpStatus)
			return
		}

		responseWriter.WriteHeader(httpStatus)
	}
}

func WrapGameApiEndpoint(
	apiHandlerFunc GameApiHandlerFunc,
) http.HandlerFunc {
	return WrapApiEndpoint(func(responseWriter http.ResponseWriter, request *http.Request) (error, int) {

		_, gameId := getFirstOccuranceInUrlParam(request, ":gameId")
		var game *gamelogic.Game
		temp, ok := games.Load(gameId)
		if ok {
			game = temp.(*gamelogic.Game)
		} else {
			return GameNotFoundError, http.StatusBadRequest
		}

		return apiHandlerFunc(game, responseWriter, request)
	})
}

func WrapPlayerApiEndpoint(
	apiHandlerFunc PlayerApiHandlerFunc,
) http.HandlerFunc {
	return WrapApiEndpoint(func(responseWriter http.ResponseWriter, request *http.Request) (error, int) {

		_, gameId := getFirstOccuranceInUrlParam(request, ":gameId")
		var game *gamelogic.Game
		temp, ok := games.Load(gameId)
		if ok {
			game = temp.(*gamelogic.Game)
		} else {
			return GameNotFoundError, http.StatusBadRequest
		}
		_, playerIdAsString := getFirstOccuranceInUrlParam(request, ":playerId")
		playerId, err := strconv.Atoi(playerIdAsString)
		if err != nil {
			return err, http.StatusBadRequest
		}

		player, err := game.GetPlayerById(playerId)
		if err != nil {
			return err, http.StatusBadRequest
		}

		return apiHandlerFunc(player, game, responseWriter, request)
	})
}

// Errors
var InvalidMethodError error = errors.New("This endpoint does not except that http method")
var GameNotFoundError error = errors.New("Game with that id was not found")
var NotImplementedError error = errors.New("That method has not been implemented yet")
var MissingParamInUrlError error = errors.New("Request Url was missing a param key")
var RoleNoteFoundError error = errors.New("This role does not exist")
var InvalidJSON error = errors.New("Invalid Json")

// Var Method Types:
const MethodGet = "GET"
const MethodPost = "POST"

func DefineRoutes() http.Handler {
	mux := pat.New()

	// static files
	// {
	// 	staticDirectoryName := "static"
	// 	staticDirectoryPaddedWithSlashes := "/" + staticDirectoryName + "/"
	//
	// 	fileServer := http.FileServer(http.Dir(staticDirectoryName))
	//
	// 	mux.Handle(
	// 		staticDirectoryPaddedWithSlashes,
	// 		http.StripPrefix(staticDirectoryPaddedWithSlashes, fileServer))
	// }

	// Redirects

	mux.Post("/api/games/{gameId}/role_pool", WrapGameApiEndpoint(AssignRolePool))
	mux.Get("/api/games/{gameId}/role_pool", WrapGameApiEndpoint(GetRolePool))

	mux.Post("/api/games/{gameId}/start", WrapGameApiEndpoint(StartGame))

	// mux.Put("/api/games/{gameId}/players/{playerId}/action", WrapPlayerApiEndpoint(GetPlayerInfo))
	mux.Get("/api/games/{gameId}/players/{playerId}", WrapPlayerApiEndpoint(GetPlayerInfo))
	mux.Post("/api/games/{gameId}/players", WrapGameApiEndpoint(CreatePlayer))

	mux.Post("/api/games", WrapApiEndpoint(CreateGame))

	mux.PathPrefix("/").Methods(http.MethodOptions).HandlerFunc(AllowAllCors)

	return mux
}

func AllowAllCors(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("myheader", "value")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "*")
}

func GetRolePool(game *gamelogic.Game, responseWriter http.ResponseWriter, request *http.Request) (error, int) {
	return NotImplementedError, http.StatusInternalServerError
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

func AssignRolePool(game *gamelogic.Game, responseWriter http.ResponseWriter, request *http.Request) (error, int) {
	rolesReq := struct{ Roles []string }{}

	if err := json.NewDecoder(request.Body).Decode(&rolesReq); err != nil {
		return InvalidJSON, http.StatusBadRequest
	}

	var roles []gamelogic.Role

	for _, roleName := range rolesReq.Roles {
		role, ok := gamelogic.RoleNameToID[roleName]
		if !ok {
			return RoleNoteFoundError, http.StatusBadRequest
		}
		roles = append(roles, role)
	}

	game.AssignRolePool(roles)
	fmt.Fprint(responseWriter, "Roll Pool Has Been Set")

	return nil, http.StatusOK
}

func StartGame(game *gamelogic.Game, responseWriter http.ResponseWriter, request *http.Request) (error, int) {

	if err := game.Start(); err != nil {
		return err, http.StatusBadRequest
	}

	go game.ExecuteNight()

	fmt.Fprint(responseWriter, "The Game's Afoot")
	return nil, http.StatusOK
}

func CreateGame(responseWriter http.ResponseWriter, request *http.Request) (error, int) {
	name := "Game1"

	game, err := gamelogic.CreateGame(name)
	if err != nil {
		return err, http.StatusInternalServerError
	}

	games.Store(name, game)

	json.NewEncoder(responseWriter).Encode(map[string]string{
		"id": game.Id,
	})

	return nil, http.StatusOK
}

func GetPlayerInfo(player *gamelogic.Player, game *gamelogic.Game, responseWriter http.ResponseWriter, request *http.Request) (error, int) {
	fmt.Fprint(responseWriter, player.String())
	return nil, http.StatusOK
}

func getFirstOccuranceInUrlParam(request *http.Request, key string) (error, string) {
	keys, ok := request.URL.Query()[key]
	fmt.Println(keys)
	fmt.Println(request.URL.Query())

	if !ok || len(keys[0]) < 1 {
		fmt.Println("here")

		return MissingParamInUrlError, ""
	}

	return nil, keys[0]
}

func CreatePlayer(game *gamelogic.Game, responseWriter http.ResponseWriter, request *http.Request) (error, int) {

	player := struct{ Name string }{}

	if err := json.NewDecoder(request.Body).Decode(&player); err != nil {
		return errors.New("Invalid json"), http.StatusBadRequest
	}

	id, err := game.AddPlayer(
		gamelogic.CreatePlayer(
			player.Name,
			NewBrowserUserInput(),
		),
	)

	if err != nil {
		return err, http.StatusBadRequest
	}

	json.NewEncoder(responseWriter).Encode(map[string]int{
		"id": id,
	})
	return nil, http.StatusOK
}
