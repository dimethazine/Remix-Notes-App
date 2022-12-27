import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Link } from "react-router-dom";
import { getStoredNotes } from "~/data/notes";
import styles from "~/styles/note-details.css";

const NoteDetailsPage = () => {
  const note = useLoaderData();
  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to all notes</Link>
        </nav>
        <h1>{note.title}</h1>
      </header>
      <p id="note-details-content">{note.content}</p>
      <form method="Delete" action="/projects">
        <button type="submit" name="intent" value="delete">
          Delete
        </button>
      </form>
    </main>
  );
};

export default NoteDetailsPage;

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export function meta({ data }) {
  const note = data;
  const titleArr = note.title.split(" ");
  for (var i = 0; i < titleArr.length; i++) {
    titleArr[i] = titleArr[i].charAt(0).toUpperCase() + titleArr[i].slice(1);
  }
  const title = titleArr.join(" ");
  return { title: title, description: "Manage your notes with ease." };
}

export async function loader({ params }) {
  // need more explanation on params in this use case ----------- found answer: params is everything after notes. in the URL section. I.e. notes/abcd - params is "abcd"
  const notes = await getStoredNotes();
  const noteId = params.noteId;
  const selectedNote = notes.find((note) => note.id === noteId);
  if (!selectedNote) {
    throw json(
      { message: `Could not find note for id: ${params.noteId}` },
      {
        status: 404,
        statusText: "Not found",
      }
    );
  }
  return selectedNote;
}

// return json(
//   await notes.findMany({
//     where: {
//       id: params.noteId,
//     },
//   })
// );
