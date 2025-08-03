import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import { Button, Typography } from "@mui/material";
import { useState, useEffect  } from "react";
import {
  useCreateTheaterHall,
  useGetAllTheatres,
  useGetTheaterHall,
} from "../../../../hooks/theatre.hooks";

const CreateHallTab = () => {
  const [theatreId, setTheatreId] = useState(null);
  const { data: theatres } = useGetAllTheatres();
  const { data: halls } = useGetTheaterHall(theatreId);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "50%" }}>
        <CreateTheatreHallForm
          theatreId={theatreId}
          setTheatreId={setTheatreId}
        />
      </div>
      <div style={{ width: "50%", padding: "10px" }}>
        {halls?.map((hall) => (

          <div 
          style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "10px",
            }} key={hall._id}>
            <h4>{`Hall Number: ${hall.number}`}</h4>
            <p>{`Seating Capacity: ${hall.seatingCapacity}`}</p>
          </div>

        
        ))}
      </div>
    </div>
  );
};

function CreateTheatreHallForm({ theatreId, setTheatreId }) {
  const { data: theatres } = useGetAllTheatres();

  const [number, setNumber] = useState("");
  const [seatingCapacity, setSeatingCapacity] = useState("");

  const { mutateAsync: createTheatreHallAsync } = useCreateTheaterHall();

  useEffect(() => {
    if (theatres && theatres.length > 0) setTheatreId(theatres[0]._id);
  }, [setTheatreId, theatres]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!theatreId) {
      alert(`Please select a theatre`);
      return;
    }
    await createTheatreHallAsync({
      number: Number(number),
      seatingCapacity: Number(seatingCapacity),
      theatreId,
    });
  };

  return (
    <div>
      <select value={theatreId} onChange={(e) => setTheatreId(e.target.value)}>
        {theatres?.map((e) => (
          <option key={e._id} value={e._id}>
            {e.name}
          </option>
        ))}
      </select>
      <Box
        style={{ marginTop: "20px" }}
        component="form"
        onSubmit={handleFormSubmit}
      >
        <div className="form-row">
          <TextField
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            fullWidth
            label="Number"
            required
          />
          <TextField
            value={seatingCapacity}
            onChange={(e) => setSeatingCapacity(e.target.value)}
            fullWidth
            label="Seating Capacity"
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

export default CreateHallTab;
