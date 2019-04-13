# HappyHourCore

[![Build Status](https://travis-ci.org/VividKnife/happy-hour-core.svg?branch=master)](https://travis-ci.org/VividKnife/happy-hour-core)
[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

This project is trying to follow [The Clean Architecture](http://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html). Contains only the core business logic of the system that can work regardless DataBase, UI, NetworkInterface and etc. 

### This is a Happy hour supply project, that have following functionalities:

## Admin API
1. Create an event with budget.
1. Add/Remove users to the event with credits.
1. Add/Remove items to the event. 
 
## User API
1. Add items to the event.
1. Spend/Return credits for an item. 

## Additional
1. Send email invitation when a user is added an event.
1. After the event ends, generate a shopping list and email to the organizer.