package backend

import (
    "fmt"
    "net/http"
    "sync"
    "log"
    // "strings"
    "errors"

    "github.com/gorilla/pat"

    "github.com/zingales/theresheep/gamelogic"
)


// type Environment struct {
//   Games sync.Map[string]*gamelogic.Game
// }

var games = new(sync.Map)

func StartServer(port string) {

    http.ListenAndServe(":8090", DefineRoutes())
    // log.Print("Let the games begin...")
}

type routeHandler struct {
	*pat.Router
}

type ApiHandlerFunc func(http.ResponseWriter, *http.Request) (error, int)

func (mux *routeHandler) HandleApi(
	// env *handlers.Environment,
  method string,
	pattern string,
	handlerFunc ApiHandlerFunc,
) {
	mux.Add(method, pattern, WrapApiEndpoint(handlerFunc))
}

func WrapApiEndpoint(
	apiHandlerFunc ApiHandlerFunc,
) http.HandlerFunc {
	return func(responseWriter http.ResponseWriter, request *http.Request) {

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

// Errors
var InvalidMethodError error = errors.New("This endpoint does not except that http method")
var GameNotFoundError error = errors.New("Game with that id was not found")

// Var Method Types:
var MethodGet = "GET"
var MethodPost = "POST"

func DefineRoutes() http.Handler {
	mux := &routeHandler{pat.New()}

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

  mux.HandleApi(MethodPost, "/api/games/{gameId}/start", StartGame)
  mux.HandleApi(MethodPost, "/api/games/{gameId}/players", CreatePlayer)


  mux.HandleApi(MethodPost, "/api/games", CreateGame)
	// mux.HandleFunc("/api/", http.NotFound)
	// mux.HandleFunc("/favicon.ico", handlers.RedirectToPathHandler("/static/favicon.ico"))
  //
	// // pages
	// mux.handleUnAutheticedRequest(env, paths.LoginOrSignupPage, handlers.HandleLoginOrSignupPageRequest)
  //
	// mux.handleAuthenticatedPage(env, paths.HomePage, handlers.HandleHomePageRequest)
	// mux.handleAuthenticatedPage(env, paths.NotesPage, handlers.HandleNotesPageRequest)
  //
	// // api
	// mux.handleUnAutheticedRequest(env, paths.UserApi, handlers.HandleUserApiRequest)
	// mux.handleUnAutheticedRequest(env, paths.SessionApi, handlers.HandleSessionApiRequest)
  //
	// mux.handleAuthenticatedApi(env, paths.NoteApi, handlers.HandleNoteApiRequest)
	// mux.handleAuthenticatedApi(env, paths.NoteCategoryApi, handlers.HandleNoteCateogryApiRequest)
	// mux.handleAuthenticatedApi(env, paths.PublicationApi, handlers.HandlePublicationApiRequest)

	return mux
}

func StartGame(responseWriter http.ResponseWriter, request *http.Request) (error, int){
  gameId := request.URL.Query().Get(":gameId")
  var game *gamelogic.Game
  temp, ok := games.Load(gameId)
  if ok {
    game = temp.(*gamelogic.Game)
  } else {
    return GameNotFoundError, http.StatusInternalServerError
  }

  if err := game.Start(); err != nil {
		return err, http.StatusBadRequest
	}

  fmt.Fprint(responseWriter, "The Game's Afoot")
  return nil, http.StatusOK
}


func CreateGame(responseWriter http.ResponseWriter, request *http.Request) (error, int){
  name := "Game1"

  game, err := gamelogic.CreateGame(name)
  if err != nil {
    return err, http.StatusInternalServerError
  }

  games.Store(name, game)

  fmt.Fprint(responseWriter, name)


  return nil, http.StatusOK
}

func CreatePlayer(responseWriter http.ResponseWriter, request *http.Request) (error, int){
  gameId := request.URL.Query().Get(":gameId")
  var game *gamelogic.Game
  temp, ok := games.Load(gameId)
  if ok {
    game = temp.(*gamelogic.Game)
  } else {
    return GameNotFoundError, http.StatusInternalServerError
  }
  name := "Bob"
  game.AddPlayer(gamelogic.CreatePlayer("Bob", &gamelogic.RandomUserInput{}))

  fmt.Fprint(responseWriter, name)
  return nil, http.StatusOK
}
