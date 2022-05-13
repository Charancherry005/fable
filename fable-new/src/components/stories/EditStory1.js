import {
  Grid,
  OutlinedInput,
  Paper,
  Select,
  Typography,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { Button, TextField, FormControl, Alert, Stack, CircularProgress } from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useRef, useContext } from "react";
import { AuthContext } from "../../firebase/Auth";
import { makeStyles } from "@material-ui/core";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "react-router-dom";
import axios from "axios";

const genres = [
  "Horror",
  "Romance",
  "Mystery",
  "Thriller",
  "Sci-fi",
  "Crime",
  "Drama",
  "Fantasy",
  "Adventure",
  "Comedy",
  "Tragedy",
  "Adult",
];

const useStyles = makeStyles({
  card1: {
    width: "100%",
    paddingLeft: "0px",
  },
  button: {
    backgroundColor: "blanchedalmond",
    color: "black",
    border: "4px solid",
  },
  genre: {
    color: "grey",
    justifyContent: "center",
    marginLeft: "auto",
    marginRight: "auto",
  },
  story: {
    color: "grey",
    justifyContent: "center",
    fontSize: "25px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  button1: {
    backgroundColor: "black",
    color: "white",
    width: "auto",
    marginLeft: "12%",
    marginRight: "auto",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
    },
  },
  buttondelete: {
    backgroundColor: "red",
    color: "white",
    width: "auto",
    marginLeft: "1%",
    marginRight: "auto",
    "&:hover": {
      backgroundColor: "red",
      color: "white",
    },
  },

  button2: {
    backgroundColor: "black",
    color: "white",
    width: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    "&:hover": {
      backgroundColor: "black",
      color: "white",
    },
  },

  button3: {
    backgroundColor: "black",
    color: "white",
    marginLeft: "auto",
    marginRight: "auto",
    "&:hover": {
      backgroundColor: "black",
      color: "#ececec",
    },
  },

  headertext: {
    backgroundColor: "#ececec",
    color: "black",
    width: "auto",
    marginLeft: "auto",
    
    paddingRight: "30px",
    paddingLeft: "30px",
    paddingTop: "10px",
    paddingBottom: "10px",
    borderRadius: "10px",
    fontSize: "40px",
  },
  paper: {
    width: "45%",
    marginLeft: "10%",
    paddingRight: "0.7%",
    maxWidth: 1500,
    height: "auto",
  },
  paperright: {
    width: "25%",
    marginLeft: "14%",
    paddingLeft: "%",
    maxHeight: "100%",
  },
  textfield1: {
    width: "127vw",
    marginLeft: "-33%",
  },
  textfield: {
    width: "38vw",
    marginLeft: "2.3%",
  },
  title: {
    marginLeft: "2.1%",
    fontSize: "25px",
  },
  story: {
    marginLeft: "34%",
    fontSize: "25px",
  },
  edit: {
    width: "100vw",
    marginLeft: "-80%",
  }, 
  grid:
  {
      width:"100%"
  }
});

const EditStory1 = () => {
  const editorRef = useRef(null);
  const [storyDetails, setStoryDetails] = useState(null);
  const { storyId } = useParams();
  let { currentUser } = useContext(AuthContext);
  const classes = useStyles();
  const [changingState, setChangingState] = useState({
    title: "",
    desc: "",
    genres: [],
    content: "",
    coverImage: "",
  });
  const [deleteModal, setDeleteModal] = useState(false);

  let existingContent;
  //   const [title, setTitle] = useState("");
  //   const [selectedGenres, setSelectedGenres] = useState("");
  //   const [shortDescription, setShortDescription] = useState("");
  //   const [coverImage, setCoverImage] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e, identifier) => {
    switch (identifier) {
      case "title":
        setChangingState({
          ...changingState,
          title: e.target.value.length !== 0 ? e.target.value : "",
        });
        break;
      case "desc":
        setChangingState({
          ...changingState,
          desc: e.target.value.length !== 0 ? e.target.value : "",
        });
        break;
      case "file":
        setChangingState({
          ...changingState,
          coverImage: e.target.value.length !== 0 ? e.target.value : "",
        });
        break;
      case "default":
        break;
    }
  };

  useEffect(() => {
    async function getStoryDetails() {
      const { data } = await axios.get(`/api/stories/${storyId}`, {
        headers: { authtoken: await currentUser.getIdToken() },
      });
      console.log(data);
      if (data.story.creatorId !== currentUser.uid) {
        setError("You don't have access to perform this action!");
        return;
      }
      setStoryDetails(data.story);
      let newState = {
        title: data.story.title,
        desc: data.story.shortDescription,
        genres: data.story.genres,
        content: data.story.contentHtml,
        coverImage: data.story.coverImage,
      };
      setChangingState(newState);
    }
    getStoryDetails();
  }, [storyId]);

  const handleGenreSelect = (e) => {
    const value = e.target.value;
    setChangingState({
      ...changingState,
      genres: typeof value === "string" ? value.split(",") : value,
    });
  };

  const updateStory = async () => {
    let formData = new FormData();
    formData.append("creatorId", currentUser.uid);
    formData.append("title", changingState.title);
    formData.append("shortDescription", changingState.desc);
    formData.append("genres", changingState.genres);
    formData.append("contentHtml", editorRef.current ? editorRef.current.getContent() : "");
    formData.append("coverImage", changingState.coverImage);
    try {
      const { data } = await axios.put(`/api/stories/${storyId}`, formData, {
        headers: {
          "Content-Type": `multipart/form-data`,
          authtoken: await currentUser.getIdToken(),
        },
      });
      if (data.success) {
        setUpdateSuccess(true);
        toast.dark("Your story has been updated successfully!");
        return;
      }
    } catch (e) {
      console.log(e);
      setError(e.message);
    }
  };

  const requestDeletionConfirmation = () => {
    setDeleteModal(true);
  };

  const handleClose = () => {
    setDeleteModal(false);
  };

  const performDelete = async () => {
    try {
      const { data } = await axios.delete(`/api/stories/${storyId}`, {
        headers: {
          authtoken: await currentUser.getIdToken(),
        },
      });
      console.log(data);
      toast.success("Successfully deleted the story.");
      setTimeout(() => navigate(`/stories`), 400);
    } catch (e) {
      console.log(e);
      toast.error("Cannot perform delete operation. " + e, {
        theme: "dark",
      });
    }
  };

  if (!storyDetails) {
    return <CircularProgress />;
  }

  return (
    <div>
      <div>
        <br />
        <Stack direction="row" spacing={2}>
          <Paper className={classes.paperright} elevation={24}>
            <Button variant="contained" component="label" className={classes.button2}>
              Upload a cover photo for your story
              <input
                type="file"
                accept="image/jpeg, image/png, .jpeg, .jpg, .png"
                onChange={(e) => handleChange(e, "file")}
              />
            </Button>
          </Paper>

          <Paper className={classes.paper} elevation={20}>
            <br />


            <Grid
              container
              
              elevation={25} 
              className={classes.grid}
            >
              <Typography
                variant="h3"
                component={"h1"}
                className={classes.headertext}
              >

                Use this place to edit and fine-tune your story!
              </Typography>
            </Grid>
            <br />
            <br />
            <br />
            <FormControl variant="standard" sx={{ m: 2, minWidth: "98.5%" }}>
              <Typography variant={"h4"} className={classes.title}>
                Title
              </Typography>
              <br />

              <TextField
                sx={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  border: "4px black",
                }}
                className={classes.textfield1}
                id="title"
                variant="outlined"
                label=" "
                placeholder="untitled story"
                value={changingState.title}
                InputLabelProps={{ shrink: false }}
                onChange={(e) => handleChange(e, "title")}
              />
              <br />
              <br />

              <Typography variant={"h4"} className={classes.title}>
                Short Description of the Story
              </Typography>
              <br />

              <TextField
                sx={{
                  marginLeft: "auto",
                  marginRight: "auto",
                  border: "4px black",
                }}
                className={classes.textfield}
                id="short_desc"
                variant="outlined"
                label=" "
                fullWidth
                placeholder="description"
                InputLabelProps={{ shrink: false }}
                minRows={4}
                maxRows={4}
                multiline
                value={changingState.desc}
                onChange={(e) => handleChange(e, "desc")}
              />

              <br />
              <br />
              <Typography variant={"h4"} className={classes.title}>
                Your Story Goes Here!
              </Typography>
              <br />
              <Editor
                required
                onLoadContent={() => {
                  setTimeout(() => {
                    let close = document.getElementsByClassName("tox-notification__dismiss")[0];
                    if (close) close.click();
                  }, 20);
                }}
                initialValue={changingState.content}
                onInit={(evt, editor) => (editorRef.current = editor)}
                init={{ max_width: 835, width: "38.5vw" }}
              />
              <br />
              <br />
              <Typography variant={"h4"} className={classes.title}>
                Select All Genres that Apply!
              </Typography>
              <br />

              <Select
                multiple
                displayEmpty
                value={changingState.genres ? changingState.genres : []}
                label=" "
                InputLabelProps={{ shrink: false }}
                onChange={handleGenreSelect}
                input={<OutlinedInput />}
                className={classes.textfield}
                renderValue={(selected) => {
                  return selected.join(", ");
                }}
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem disabled value="">
                  <em>Select All that Apply!</em>
                </MenuItem>
                {genres.map((genre, idx) => (
                  <MenuItem key={idx} value={genre}>
                    {genre}
                  </MenuItem>
                ))}
              </Select>
              <br />
              <br />
              <span>
                <Button onClick={updateStory} className={classes.button1}>
                  Update Story
                </Button>

                <Button className={classes.buttondelete} onClick={requestDeletionConfirmation}>
                  Delete Story
                </Button>
              </span>
              <br />
            </FormControl>
          </Paper>
        </Stack>
        <Dialog open={deleteModal}>
          <DialogTitle id="title-text-conf">
            {"Are you sure you want to delete this story? This action cannot be reversed."}
          </DialogTitle>
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => {
                performDelete();
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
        <br />
        <br />
      </div>
    </div>
  );
};

export default EditStory1;
