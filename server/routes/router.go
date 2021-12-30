package routes

import (
	"github.com/gin-gonic/gin"
	s "github.com/joshmleslie/web-duet/server/services"
)

func SetRoutes(router *gin.Engine) {
	router.NoRoute(s.AppServeHandler)

	versionOne(router)
}
