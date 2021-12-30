package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func healthCheckHandler(ctx *gin.Context) {
	ctx.String(http.StatusOK, "ok")
}
