# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ibertran <ibertran@student.42lyon.fr>      +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2024/12/02 02:17:33 by ibertran          #+#    #+#              #
#    Updated: 2024/12/12 20:40:01 by ibertran         ###   ########lyon.fr    #
#                                                                              #
# **************************************************************************** #

NAME := projects-tracker
COMPOSE_FILE := docker-compose.prod.yaml

.PHONY: production
production:
	docker compose -p $(NAME) -f $(COMPOSE_FILE) up --build -d

.PHONY: down
down:
	docker compose -p $(NAME) -f $(COMPOSE_FILE) down

# **************************************************************************** #
