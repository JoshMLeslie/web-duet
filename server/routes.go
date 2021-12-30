package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func noRouteHandler(ctx *gin.Context) {
	ctx.String(http.StatusNotFound, "Not found")
}

func healthCheckHandler(ctx *gin.Context) {
	ctx.String(http.StatusOK, "ok")
}

func SetRoutes(router *gin.Engine) {
	router.NoRoute(noRouteHandler)

	v1 := router.Group("/v1")
	{
		v1.GET("/health", healthCheckHandler)
		v1.GET("/ws", WsHandler)
	}
}
