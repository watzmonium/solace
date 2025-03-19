# Solace Take-Home

## Initial thoughts

On my cursory glance of the repo, there are some pretty glaring issues that I do not think I can properly address in 2 hours.
I'm going to list them here and talk about what I can and can't do in 2 hours, as well as why I will address what I am chosing to address.

1. No layer between FE and DB - major secruity issue and antipattern
2. FE running on a development server
3. No way to serve a minimized FE build
4. Major bugs in the react code
5. No pagination/filtering logic on DB queries
6. Site is not user-friendly

If I had more time, I would create more containers on the docker compose - nginx, some kind of backend like express - and use those to run the production server.

Because I have 2 hours, I am going to focus on number 4-6 on this list, because that is an amount of work I can address in 2 hours.

## Plan of Action

30 mins:

- fix issues in react code `page.tsx`
  - direct manipulation of DOM
  - debounce onChange
  - missing key prop
  - error handling

1 hour:

- refactor DB logic
  - learn basics of drizzle ORM
  - making pagination and filtering happen via API layer

30 mins:

- UI/UX polish
  - improve table styling
  - improve app responsiveness
  - loading and no results logic
  - icons if time allows
