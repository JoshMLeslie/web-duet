package main

import "github.com/gin-gonic/gin"

func SetRoutes(router *gin.Engine) {
	router.NoRoute(func(ctx *gin.Context) {
		ctx.JSON(404, gin.H{
			"message": "Not found",
		})
		return
	})

	router.GET("/ws", WsHandler)
}
