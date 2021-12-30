package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	r "github.com/joshmleslie/web-duet/server/routes"
)

func start(server *http.Server) {
	err := server.ListenAndServe()
	if err != nil {
		log.Printf("listen: %s\n", err)
	}
}

func StartServer() *http.Server {
	router := gin.Default()
	server := &http.Server{
		Addr:    ":3000",
		Handler: router,
	}

	r.SetRoutes(router)

	// Start server in a goroutine so it won't block shutdown handling
	go start(server)

	return server
}
