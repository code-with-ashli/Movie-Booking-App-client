import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { Button, Typography } from "@mui/material";
import { useState } from "react";
import {
    useCreateMovie,
    useDeleteMovie,
    useGetAllMovies,
} from "../../../../hooks/movie.hooks";


const CreateMovieTab = () => {
    const { data: movies } = useGetAllMovies();
    const {mutate: deleteMovie, isLoading: isDeleting} = useDeleteMovie();
  return (
    <div style={{ display: "flex",  }}>
      <div style={{ width: "50%" }}>
        <CreateMovieForm />
      </div>
      <div style={{ width: "50%", padding: "10px" }}>
        {movies?.map((movie) => (
          <div style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "10px",
            }} key={movie._id}
            >
               <h4>{movie.title}</h4> 
               <p>
                {`${movie.description},
                ${movie.language},
                ${movie.durationInMinutes} minutes`}
               </p>
               <button onClick={() => deleteMovie(movie._id)}
                style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
                >
                Delete
               </button>
          </div>
          // <li style={{listStyle: "none"}} key={movie._id}>
          //   <pre>{JSON.stringify(movie, null , 2)}</pre>
          // </li>
        ))}
      </div>
    </div>
  );
};


function CreateMovieForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [language, setLanguage] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [durationInMinutes, setDurationInMinutes] = useState("");
  
    const { mutateAsync: createMovieAsync } = useCreateMovie();
  
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
          const movieData = {
            title,
            description,
            language,
            imageURL,
            durationInMinutes: Number(durationInMinutes),
          };
          const filteredMovieData = Object.fromEntries(
            // eslint-disable-next-line no-unused-vars
            Object.entries(movieData).filter(([_, value]) => value)
          );
          await createMovieAsync(filteredMovieData);
          setTitle("");
          setDescription("");
          setLanguage("");
          setImageURL("");
          setDurationInMinutes("");
        } catch (error) {
          console.log(error);
        }
    
    };

    return (
        <div>
          <Typography variant="h3">Movies</Typography>
          <Box component="form" onSubmit={handleFormSubmit}>
            <div className="form-row">
              <TextField
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                label="Movie Name"
                required
              />
              <TextField
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                label="description"
              />
              <TextField
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                fullWidth
                label="language"
              />
              <TextField
                value={imageURL}
                onChange={(e) => setImageURL(e.target.value)}
                fullWidth
                label="imageURL"
              />
              <TextField
                value={durationInMinutes}
                onChange={(e) => setDurationInMinutes(e.target.value)}
                fullWidth
                label="durationInMinutes"
                required
              />
            
            </div>
            <div className="form-row">
              <Button type="submit" fullWidth variant="contained">
                Submit
              </Button>
            </div>
          </Box>
        </div>
      );
    }

export default CreateMovieTab;