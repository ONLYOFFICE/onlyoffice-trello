package pkg

import "testing"

func TestJwtVerification(t *testing.T) {
	t.Parallel()

	const (
		validToken  = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJNb2NrIiwiaWF0IjoxNjQyNjYyOTIxLCJleHAiOjE2NzQxOTg5MjEsImF1ZCI6Im1vY2siLCJzdWIiOiIifQ.uifuVYMxPQcohxp2bXgtKKRN6dcRqMQaVymyPNV1yos"
		validSecret = "secret"
	)

	tests := []struct {
		name    string
		token   string
		secret  string
		withErr bool
	}{
		{
			name:    "OK: Valid Token",
			token:   validToken,
			secret:  validSecret,
			withErr: false,
		}, {
			name:    "Failure: Invalid Secret",
			token:   validToken,
			secret:  "mocksecret",
			withErr: true,
		}, {
			name:    "Failure: Invalid Token",
			token:   "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJNb2NrIiwiaWF0IjoxNjQyNjYyOTIxLCJleHAiOjE2NzQxOTg5MjEsImF1ZCI6Im1vY2siLCJzdWIiOiIifQ._DOO8UiX5GxBUmNczekmHaehhBh5LBHroKpG5mq8JXc",
			secret:  validSecret,
			withErr: true,
		}, {
			name:    "Failure: Malformed Jwt",
			token:   "Not a jwt at all",
			secret:  validSecret,
			withErr: true,
		},
	}

	for _, test := range tests {
		tt := test

		t.Run(tt.name, func(t *testing.T) {
			if actualErr := ValidateJWT(tt.token, []byte(tt.secret)); (actualErr != nil) != tt.withErr {
				t.Fatalf("expected error %t, got %s", tt.withErr, actualErr)
			}
		})
	}
}
