package routes

import (
	"github.com/gin-gonic/gin"
	s "github.com/joshmleslie/web-duet/server/services"
)

func versionOne(router *gin.Engine) *gin.RouterGroup {
	v1 := router.Group("/v1")
	v1.GET("/health", healthCheckHandler)
	v1.GET("/ws", s.WsHandler)
	return v1
}
