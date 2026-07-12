# 🎬 TMDB Movie Database Clone

A React.js web application inspired by the Data18 website, built using **The Movie Database (TMDB) API**. The application allows users to browse Hindi movies, directors, studios, genres, actors, and detailed movie information.

---

## 📌 Features

- Browse latest Hindi movies
- View movie details
- Browse movie directors
- Browse production studios
- Browse movie genres
- Browse actors
- Filter movies by:
  - Director
  - Studio
  - Genre
- Responsive slide menu
- Pagination
- Search functionality
- TMDB posters, cast and images

---

## 🛠 Tech Stack

### Frontend
- React.js
- React Router DOM
- CSS Modules
- React Icons

### API
- TMDB (The Movie Database) API

### Tools
- Vite
- JavaScript (ES6)

---

## 📂 Project Structure

```
src/
│
├── components/
│   ├── Sidebar.jsx
│   ├── SlideMenu.jsx
│   ├── Topbar.jsx
│   ├── MovieCard.jsx
│   ├── Pagination.jsx
│
├── pages/
│   ├── HomePage.jsx
│   ├── DirectorsList.jsx
│   ├── StudiosList.jsx
│   ├── GenresList.jsx
│   ├── FilteredMovies.jsx
│   ├── MovieDetails.jsx
│   ├── MoviePhotos.jsx
│   ├── ActorProfile.jsx
│   └── Actors.jsx
│
├── styles/
│   ├── HomePage.module.css
│   ├── Sidebar.module.css
│   ├── SlideMenu.module.css
│   ├── DirectorsList.module.css
│   ├── StudiosList.module.css
│   ├── GenresList.module.css
│   └── ...
│
├── utils/
│   └── tmdb.js
│
├── App.jsx
└── main.jsx
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/tmdb-movie-database.git
```

Go inside the project

```bash
cd tmdb-movie-database
```

Install dependencies

```bash
npm install
```

Run the development server

```bash
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in the project root.

```
VITE_TMDB_TOKEN=YOUR_TMDB_BEARER_TOKEN
```

Get your API Token from

https://developer.themoviedb.org/

---

## 📷 Screens

- Home Page
- Movie Details
- Movie Images
- Directors
- Studios
- Genres
- Actors
- Slide Menu

---

## 🚀 Implemented Features

### Home Page
- Latest Hindi movies
- Filter panel
- Sidebar
- Right information panel
- Pagination

### Movie Details
- Movie overview
- Cast
- Posters
- Backdrops

### Directors
- Director list
- Movie count
- Search
- Click to view directed movies

### Studios
- Studio list
- Movie count
- Search

### Genres
- Genre list
- Browse movies by genre

### Actors
- Actor profiles
- Movies featuring actors

### Sidebar
- Movie categories
- Dynamic counts
- Navigation

### Slide Menu
- Floating slide menu
- Scrollable content
- Responsive layout

---

## 📦 API Endpoints Used

### Movies

```
/discover/movie
/movie/{id}
/movie/{id}/credits
/movie/{id}/images
```

### Genres

```
/genre/movie/list
```

### People

```
/person/popular
/search/person
/person/{id}/movie_credits
```

### Studios

```
/movie/{id}
```

---

## 🎨 UI Design

The project UI is inspired by the Data18 website while using TMDB movie data.

Features include:

- Three-column layout
- Fixed top navigation
- Left navigation sidebar
- Right information sidebar
- Expandable filters
- Responsive slide menu
- Movie cards with posters
- Pagination

---

## 📈 Future Improvements

- Authentication
- Favorites
- Watchlist
- Infinite scrolling
- Movie trailers
- Dark mode
- Better search filters
- Actor filmography
- Studio pages
- Similar movies

---

## 👨‍💻 Author

**Hari Ram**

GitHub: https://github.com/hariram130303

---

## 📜 License

This project is developed for educational purposes using the TMDB API.

TMDB data is provided under TMDB's API Terms of Use.
