import {useEffect} from "react";
const API_KEY = "3b13c6d35764ba7eedf06e324b7da298";
function Movie() {

    const getMovie = () => {
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`)
        .then(res => res.json())
        .then(json => console.log(json))
    }
    useEffect(() => {
        getMovie();
    }, []);

    return (
        <div>
            Movie
        </div>
    );
}

export default Movie;