Node.js + Express + MongoDB backend for a dynamic, admin-driven form builder.
Admins can create forms and fields (including conditional fields). Public users can fetch form definitions and submit responses. Submissions are validated server-side and stored in MongoDB.

<!-- Project status -->
This repository contains a working backend that supports:

Admin: create / update / delete forms

Admin: create / update / delete / reorder fields (fields stored in single collection)

Conditional fields (child fields visible only when parent option selected)

Public: list available forms and fetch single form definition (form + fields)

Public: submit form responses (server-side validation based on field config)

Admin: list submissions with pagination

Token-based minimal admin authentication (static token via .env)

<!-- Tech stack -->

Node.js (LTS)

Express

MongoDB + Mongoose

dotenv for config

git clone https://github.com/<your-username>/<repo-name>.git

<!-- intall -->
npm install

<!-- Create environment file -->
Create config/config.env

<!-- in the env file -->

MONGO_URI=<your-mongodb-connection-string>
ADMIN_TOKEN=secret_token_123@_123@   
PORT=5000
MODE=development

<!-- Start server -->
node app.js
# or if you use nodemon
npx nodemon app.js
<!-- Server will connect to MongoDB and listen on PORT defined in env (default 3000 if not set). -->

<!-- Add convenient scripts to package.json -->

"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}


<!-- Data model summary -->

<!-- Form -->

_id, title, description, isArchive, createdAt, updatedAt

<!-- Field -->

_id, formId, label, name (unique per form), type (text, radio, select, checkbox, number, email, date, textarea), required, options (for radio/select/checkbox), validation (min, max, regex), order, visibility (parentFieldId, showWhenOptionValue)

<!-- Submission -->

_id, formId, answers (object keyed by field.name), meta (ip, userAgent), submittedAt, timestamps