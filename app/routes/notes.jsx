import { json, redirect } from "@remix-run/node";
import { Link, useCatch, useLoaderData } from "@remix-run/react";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";

import NoteList, { links as noteListLinks } from "~/components/NoteList";
import { getStoredNotes, storeNotes } from "~/data/notes";

const NotesPage = () => {
  let notes = useLoaderData();

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
};

export default NotesPage;

export async function loader() {
  const notes = await getStoredNotes();
  if (!notes || notes.length === 0) {
    throw json(
      { message: "Could not find any notes." },
      {
        status: 404,
        statusText: "Not Found",
      }
    );
  }
  return notes;
  //////////////////////////////////////////////////////////////////////////////////////////////
  // return json(notes); // Another way to do it through Remix and JSON
  //////////////////////////////////////////////////////////////////////////////////////////////
  // return new Response(JSON.stringify(notes), {  // Longer way to do it directly with NodeJS
  //   headers: { "Content-Type": "application/json" },
  // });
  //////////////////////////////////////////////////////////////////////////////////////////////
}

// Submit request from form page. This links with NewNote.jsx under components
export async function action({ request }) {
  // function name, asynchronous, takes the request as an argument which contains the title and the body
  const formData = await request.formData(); // This stores the formData from the "request" argument in the formData variable
  const noteData = Object.fromEntries(formData); // Converts the array into an object, and saves it into noteData variable
  console.log(formData); // This is the object with the containing data with keys and values. In the case of the above, it'll have a title and content key, and the value is what the user entered for the form

  // {
  //   title: formData.get("title"),
  //   content: formData.get("content"),
  // };

  // Add validation...
  if (noteData.title.trim().length < 5) {
    return { message: "Invalid title - must be at least 5 characters long." };
  }
  const existingNotes = await getStoredNotes(); // getStoredNotes function from "notes.js" stored in the existingNotes variable
  noteData.id = new Date().toISOString(); // add a key value pair. The key is "id" and the value is the current date in ISO string. Value would look like 2022-12-23T05:45:43.967Z

  const updatedNotes = existingNotes.concat(noteData); // Adds the new note, "noteData", to the existing notes from "existingNotes." Stored this as "updatedNotes"
  await storeNotes(updatedNotes); // Use the storeNotes(args) function from "notes.js" to store the notes
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));

  return redirect("/notes");
}

export function CatchBoundary() {
  const caughtResponse = useCatch();

  const message = caughtResponse.data?.message || "Data not found.";

  return (
    <main>
      <NewNote />
      <p className="info-message">{message}</p>
    </main>
  );
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}

export function meta() {
  return { title: "All Notes", description: "Manage your notes with ease." };
}

export function ErrorBoundary({ error }) {
  return (
    <main className="error">
      <h1>An error related to your notes occurred!</h1>
      <p>{error.message}</p>
      <p>
        Back to <Link to="/">safety</Link>
      </p>
    </main>
  );
}
