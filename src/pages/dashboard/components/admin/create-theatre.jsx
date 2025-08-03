import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import { useState } from "react";
import {
  useCreateTheatre,
  useGetAllTheatres,
  useDeleteTheatre,
} from "../../../../hooks/theatre.hooks";



const CreateTheatreTab = () => {
  const { data: theatres } = useGetAllTheatres();
  const { mutate: deleteTheatre, isLoading: isDeleting } = useDeleteTheatre();
  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "50%" }}>
        <CreateTheatreForm />
      </div>
      <div style={{ width: "50%", padding: "10px" }}>
        {theatres?.map((theatre) => (
          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "10px",
            }}
            key={theatre._id}
          >
            <h4>{theatre.name}</h4>
            <p>{`${theatre.plot}, 
            ${theatre.street}, 
            ${theatre.city}, 
            ${theatre.state}, 
            ${theatre.country} - ${theatre.pincode}`}</p>
            <button
              onClick={() => deleteTheatre(theatre._id)}
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
        ))}
      </div>
    </div>
  );
};

function CreateTheatreForm() {
  const [name, setName] = useState("");
  const [plot, setPlot] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [pincode, setPincode] = useState("");

  const { mutateAsync: createTheatreAsync } = useCreateTheatre();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await createTheatreAsync({
      name,
      plot,
      street,
      city,
      state,
      country,
      pincode: Number(pincode),
    });
  };

  return (
    <div>
      <Typography variant="h3">Theatre</Typography>
      <Box component="form" onSubmit={handleFormSubmit}>
        <div className="form-row">
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            label="Theatre Name"
            required
          />
          <TextField
            value={plot}
            onChange={(e) => setPlot(e.target.value)}
            fullWidth
            label="plot"
            required
          />
          <TextField
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            fullWidth
            label="street"
            required
          />
          <TextField
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
            label="City"
            required
          />
          <TextField
            value={state}
            onChange={(e) => setState(e.target.value)}
            fullWidth
            label="state"
            required
          />
          <TextField
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            fullWidth
            label="Country"
            required
          />
          <TextField
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            fullWidth
            label="Pincode"
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

export default CreateTheatreTab;
