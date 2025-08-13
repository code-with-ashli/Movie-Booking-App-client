import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import {
  useGetShowsByMovieId,
  useCreateShow,
  useGetAllTheatres,
  useGetTheaterHall,
  useDeleteShow,
} from "../../../../hooks/theatre.hooks";
import { useGetAllMovies } from "../../../../hooks/movie.hooks";

const formatDateTime = (epochMs) => {
  const date = new Date(epochMs); // your timestamp is already in ms
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const CreateShowTab = () => {
  const [movieId, setMovieId] = useState(null);
  const { mutate: deleteShow, isLoading: isDeleting } = useDeleteShow();
  const { data: shows } = useGetShowsByMovieId(movieId);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "50%" }}>
        <CreateShowForm movieId={movieId} setMovieId={setMovieId} />
      </div>
      <div style={{ width: "50%", padding: "10px" }}>
        <Typography variant="h3" align="center">
          Shows List
        </Typography>
        {shows?.map((show) => (
          //   <li style={{ listStyle: "none" }} key={show._id}>
          //   <pre>{JSON.stringify(show, null, 2)}</pre>
          // </li>
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "10px",
            }}
            key={show._id}
          >
            <h4>
              <strong>Movie:</strong> {show.movieId?.title}
            </h4>
            <p>
              <strong>Theatre:</strong> {show.theatreHallId?.theatreId?.name}
            </p>
            <p>{`${formatDateTime(show.startTimeStamp)}, ${formatDateTime(
              show.endTimeStamp
            )}`}</p>
            <button
              onClick={() => deleteShow(show._id)}
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

          // <li style={{ listStyle: "none" }} key={show._id}>
          //   <pre>{JSON.stringify(show, null, 2)}</pre>
          // </li>
        ))}
      </div>
    </div>
  );
};

function CreateShowForm({ movieId, setMovieId }) {
  const [theatreId, setTheatreId] = useState(null);
  const [hallId, setHallId] = useState(null);
  const [price, setPrice] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const { data: theatres } = useGetAllTheatres();

  const { data: movies } = useGetAllMovies();

  const { data: halls } = useGetTheaterHall(theatreId);

  useEffect(() => {
    if (theatres && theatres.length > 0) setTheatreId(theatres[0]._id);
  }, [theatres]);

  useEffect(() => {
    if (movies && movies.length > 0) setMovieId(movies[0]._id);
  }, [movies, setMovieId]);

  useEffect(() => {
    if (halls && halls.length > 0) setHallId(halls[0]._id);
  }, [halls, movies]);

  const { mutateAsync: createShowAsync } = useCreateShow();

  useEffect(() => {
    if (theatres && theatres.length > 0) setTheatreId(theatres[0]._id);
  }, [setTheatreId, theatres]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await createShowAsync({
      movieId,
      theatreHallId: hallId,
      startTimeStamp: new Date(startTime).getTime(),
      endTimeStamp: new Date(endTime).getTime(),
      price: Number(price),
    });
  };

  return (
    <div>
      <Typography variant="h3" align="center">
        Create a Show
      </Typography>
      <div>
        <h4>Select a Movie</h4>
        <select value={movieId} onChange={(e) => setMovieId(e.target.value)}>
          {movies?.map((e) => (
            <option key={e._id} value={e._id}>
              {e.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h4>Select a Theatre</h4>
        <select
          value={theatreId}
          onChange={(e) => setTheatreId(e.target.value)}
        >
          {theatres?.map((e) => (
            <option key={e._id} value={e._id}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      <div>
         <h4>Select a Hall</h4>
        {theatreId && (
          <select value={hallId} onChange={(e) => setHallId(e.target.value)}>
            {halls?.map((e) => (
              <option key={e._id} value={e._id}>
                {e.number} {`(${e.seatingCapacity})`}
              </option>
            ))}
          </select>
        )}
      </div>

      <Box
        style={{ marginTop: "20px" }}
        component="form"
        onSubmit={handleFormSubmit}
      >
        <div className="form-row">
          <TextField
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            label="Price"
            required
          />
          <TextField
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            fullWidth
            type="datetime-local"
            label="Start Time"
            required
          />
          <TextField
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            fullWidth
            type="datetime-local"
            label="End Time"
            required
          />
        </div>
        <Button disabled={!theatreId} variant="outlined" type="submit">
          Submit
        </Button>
      </Box>
    </div>
  );
}

export default CreateShowTab;
