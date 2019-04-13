# HappyHourCore

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/83a4580353a74865b60e67954b2537c2)](https://app.codacy.com/app/skang7/happy-hour-core?utm_source=github.com&utm_medium=referral&utm_content=VividKnife/happy-hour-core&utm_campaign=Badge_Grade_Dashboard)
[![Build Status](https://travis-ci.org/VividKnife/happy-hour-core.svg?branch=master)](https://travis-ci.org/VividKnife/happy-hour-core)
[![Coverage Status](https://coveralls.io/repos/github/VividKnife/happy-hour-core/badge.svg?branch=master)](https://coveralls.io/github/VividKnife/happy-hour-core?branch=master)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier) [![Greenkeeper badge](https://badges.greenkeeper.io/VividKnife/happy-hour-core.svg)](https://greenkeeper.io/)

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
