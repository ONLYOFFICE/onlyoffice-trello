package pkg

import (
	"encoding/json"
	"net/http"
)

func ResponseOK(w http.ResponseWriter, body interface{}) {
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(body)
}

func ResponseError(w http.ResponseWriter, code int, reason string) {
	w.WriteHeader(code)
	w.Header().Set("Content-Type", "application/json")

	payload := map[string]string{
		"error": reason,
	}

	json.NewEncoder(w).Encode(payload)
}
