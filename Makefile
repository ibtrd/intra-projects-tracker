# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ibertran <ibertran@student.42lyon.fr>      +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/12/02 02:17:33 by ibertran          #+#    #+#              #
#    Updated: 2024/12/11 16:49:00 by ibertran         ###   ########lyon.fr    #
#                                                                              #
# **************************************************************************** #

NAME := exam-tracker
COMPOSE_FILE := docker-compose.prod.yaml

.PHONY: production
production:
	docker compose -p $(NAME) -f $(COMPOSE_FILE) up --build -d

.PHONY: down
down:
	docker compose -p $(NAME) -f $(COMPOSE_FILE) down

# **************************************************************************** #

WEBSITE := localhost
SECRETS_DIR := secrets/ssl/
SSL_CERT := $(SECRETS_DIR)$(WEBSITE).crt
SSL_KEY := $(SECRETS_DIR)$(WEBSITE).key

.PHONY: ssl
ssl: $(SSL_CERT) $(SSL_KEY)

$(SSL_CERT) $(SSL_KEY): | $(SECRETS_DIR)
	openssl req -x509 -newkey rsa:4096 -sha256 -days 3650 \
	-nodes -keyout $(SSL_KEY) -out $(SSL_CERT) -subj "/CN=$(WEBSITE)" \
	-addext "subjectAltName=DNS:$(WEBSITE),DNS:*.$(WEBSITE),IP:10.0.0.1" 2> /dev/null

$(SECRETS_DIR):
	mkdir -p $@