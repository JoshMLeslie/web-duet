package util

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"
)

func HandleSafeQuit(server *http.Server) {
	// Graceful shutdown with sigint
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit

	log.Println("\nServer shutting down...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatal("Server Shutdown:", err)
	}
	log.Println("Server exiting")
}
