import {
  Badge,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Fab,
  Grid,
  InputLabel,
  Paper,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Switch,

} from "@material-ui/core";
import React from "react";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../firebase/Auth";
import Hero from "../Hero";
import axios from "axios";
import { makeStyles } from "@material-ui/styles";
import Input from "@mui/material/Input";
import Modal from "@mui/material/Modal";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Add from "@mui/icons-material/Add";
import { Stack } from "@mui/material";
import { toast } from "react-toastify";
import { red } from "@material-ui/core/colors";

const useStyles = makeStyles({
  card1: {
    width: "30%",
    paddingLeft: "300px",
  },
  card: {
    width: "auto",
    minWidth: "600px",
    marginLeft: "100%",
    paddingLeft: "0%",
  },
  card2: {
    marginLeft: "0px",
  },
  card3: {
    width: "700%",
  },
  card4: {overflow: "inherit",

    marginLeft: "3%",
    paddingRight:10,
    width: "100%",
  },
  card5: {
    overflow: "inherit",
    width: "100%",
    color:'red',
  },
  create: {
    marginLeft: "50%",
    height: "35px",
    borderRadius: "0px",
  },
  create1: {
    marginLeft: "50%",
    height: "auto",
    width: "60%",
    maxWidth: "100%",
    borderRadius: "0px",
  },
  paper: { width: "80%", marginRight: "10%", paddingRight: "20%", paddingLeft: "0%", position: "absolute" },
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#343a40",
  color: "#f8f9fa",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ViewLibrariesList = () => {
  const [libraryData, setLibraryData] = useState([]);
  const [libraryName, setLibraryName] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const classes = useStyles();
  const [createLib, setCreateLib] = useState(false);
  const [editLib, seteditLib] = useState(false);
  const [delLib,setDelLib]=useState(false);
  const [changingState, setChangingState] = useState({
    title: "",
  });
  const openCreateLibModal = () => setCreateLib(true);
  const closeCreateLibModal = () => setCreateLib(false);
  const openDelLibModal=()=>setDelLib(true);
  const closeDelLibModal=()=>setDelLib(false);
  const openeditLibModal=()=>seteditLib(true);
  const closeeditLibModal=()=>seteditLib(false);

  // const handleChange = (e, identifier) => {
  //   switch (identifier) {
  //     case "title":
  //       setChangingState({ ...changingState, title: e.target.value.length !== 0 ? e.target.value : "" });
  //       break;
  //   }
  // };
  const createLibrary = async () => {
    try {
      const { data } = await axios.post(
        `/api/libraries/`,
        {
          userId: currentUser.uid,
          libraryName: libraryName,
          private: isPrivate,
        },
        { headers: { authtoken: await currentUser.getIdToken() } }
      );
      console.log(data);
      if (data.success) {
        setLibraryName("");
        setIsPrivate(true);
        let libraries = [];
        for (const library of libraryData) {
          libraries.push(library);
        }
        libraries.push(data.library);
        setLibraryData(libraries);
        closeCreateLibModal();
        setCreationSuccess(true);
      }
    } catch (e) {
      console.log(e);
      toast.dark(e.response.data.error);
    }
  };
  const handleClose = () => {
    setDelLib(false);
  };
  useEffect(() => {
    async function getOwnerLibraries() {
      const { data } = await axios.get(`/api/libraries/me?owner=${currentUser.uid}`, {
        headers: { authtoken: await currentUser.getIdToken() },
      });
      console.log(data);
      setLibraryData(data.libraries);
    }
    getOwnerLibraries();
  }, []);

  return (
    <div>
      {/* <Hero title={""} /> */}
      <br />
      <br />

      <div className={classes.libTitle}>
        <Typography variant="h2"> Library</Typography>
      </div>
      <Divider />
     <br />
      <br />
    
      <Paper
        elevation={0}
        className={classes.paper}
        sx={{
          bgcolor: "background.default",
          display: "grid",
          gridTemplateColumns: { md: "1fr 1fr" },
          gap: 2,
          height: "auto",
        }}
      >
        <Stack direction={"column"} spacing={2}>
          <Card className={classes.card2} elevation={0}>
            {/* <Fab
              className={classes.create}
              color="primary"
              variant="extended"
              onClick={() => navigate(`/libraries/create`)}
            >
              <Add />
              Create a new library
            </Fab> */}
            <Fab className={classes.create} color="primary" variant="extended" onClick={openCreateLibModal}>
              <Add />
              Create a new library
            </Fab>
          </Card>
        </Stack>
        <br />


        <Modal
          open={createLib}
          onClose={closeCreateLibModal}
          arial
          abelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create your own library here
            </Typography>
            <InputLabel style={{ color: "#fff" }} id="lib-select-label">
              Library Name
            </InputLabel>
            <Input
              sx={{
                width: "30%",
                marginLeft: "auto",
                marginRight: "auto",
                paddingTop: "35px",
                border: "4px black",
              }}
              id="libraryName"
              label="Enter a name for your library"
              variant="filled"
              value={libraryName}
              required
              onChange={(e) => {
                setLibraryName(e.target.value);
              }}
            />
            <Typography className={classes.story}>
              Want everyone to view your library? Make it public *
              <Switch
                checked={isPrivate}
                onChange={() => {
                  setIsPrivate(!isPrivate);
                }}
                label={isPrivate ? "Public" : "Private"}
              />
            </Typography>
            <br />
            <br />
            <Button variant="contained" onClick={createLibrary} className={classes.button1}>
              Create Library
            </Button>
          </Box>
        </Modal>
      


        <Modal
          open={editLib}
          onClose={closeeditLibModal}
          arial
          abelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Edit your own library here
            </Typography>
            <InputLabel style={{ color: "#fff" }} id="lib-select-label">
              Library Name
            </InputLabel>
            <Input
              sx={{
                width: "30%",
                marginLeft: "auto",
                marginRight: "auto",
                paddingTop: "35px",
                border: "4px black",
              }}
              id="libraryName"
              label="Enter a name for your library"
              variant="filled"
              value={libraryName}
              required
              onChange={(e) => {
                setLibraryName(e.target.value);
              }}
            />
            <Typography className={classes.story}>
              Want everyone to view your library? Make it public *
              <Switch
                checked={isPrivate}
                onChange={() => {
                  setIsPrivate(!isPrivate);
                }}
                label={isPrivate ? "Public" : "Private"}
              />
            </Typography>
            <br />
            <br />
            <Button variant="contained" onClick={createLibrary} className={classes.button1}>
              Edit Library
            </Button>
          </Box>
        </Modal>



       
        <Stack direction={"column"} spacing={2}>
          {libraryData &&
            libraryData.length > 0 &&
            libraryData.map((lib) => {
              return (
                <div>
                  <span>
                    <Card className={classes.create1} elevation={5}>
                      <CardContent>
                        <Stack spacing={0} direction={"row"}>
                          <Card className={classes.card3} elevation={0}>
                            <Stack direction="row" spacing={2}>
                            <Badge
                              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            >
                              <LibraryBooksIcon />
                            </Badge>
                            <Link to={`/libraries/${lib._id}`}>
                              <Typography variant="body1">
                                {lib.libraryName.length > 20
                                  ? lib.libraryName.length.substring(16) + "..."
                                  : lib.libraryName}
                              </Typography>
                            </Link>
                            <Typography variant="overline">
                              ({lib.stories.length} Stories Inside)
                            </Typography>
                            </Stack>
                          </Card>




                          <Stack spacing={1} direction={"row"}>
                          <Card className={classes.card4}  elevation={0}>
                            <Fab className={classes.edit} color="primary" onClick={openeditLibModal}  >
                              <EditIcon />
                            </Fab>
                          </Card>
                          </Stack>


                          <Dialog open={delLib}>
          <DialogTitle id="title-text-conf">
            {"Are you sure you want to delete this story? This action cannot be reversed."}
          </DialogTitle>
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => {
            
                handleClose();
              }}
              color="error"
            >
              Confirm
            </Button>
            <Button variant="contained" onClick={handleClose}>
              No, take me back
            </Button>
          </DialogActions>
        </Dialog>
                       
                          <Card className={classes.card5} elevation={0}>
                            <Fab className={classes.delete} color="inherit" onClick={openDelLibModal}>
                              <DeleteIcon />
                            </Fab>
                          </Card>



                        </Stack>
                        <Stack spacing={2} direction={"row"}></Stack>
                        {/* </Stack> */}
                      </CardContent>
                    </Card>
                  </span>
                </div>
              );
            })}
          {libraryData && libraryData.length === 0 && (
            <div>
              Seems like you're missing out on so much fun! <Link to={`/libraries/create`} class="text-decoration-none">Click here</Link> to create
              your own library, make it public and much more!
            </div>
          )}
        </Stack>

        <br />
      </Paper>
    </div>
  );
};

export default ViewLibrariesList;
