# API Documentation & React Implementation Guide

## Base Configuration
- **Base URL**: `http://localhost:5000/api/auth`
- **Admin Token**: Required for admin endpoints (set in `config.env` as `ADMIN_TOKEN`)
- **Authorization Header Format**: `Authorization: Bearer <ADMIN_TOKEN>`
- **CORS**: Enabled for common frontend ports (3000, 3001, 5173, 5174). To customize, set `FRONTEND_URL` in `config.env`

---

## CORS Configuration

The backend has CORS enabled by default. If you're getting CORS errors:

1. **Check your frontend port**: The default configuration allows:
   - `http://localhost:3000` (Create React App default)
   - `http://localhost:3001` (Alternative React port)
   - `http://localhost:5173` (Vite default)
   - `http://localhost:5174` (Vite alternative)

2. **Custom Frontend URL**: If your frontend runs on a different port, add to `config.env`:
   ```
   FRONTEND_URL=http://localhost:YOUR_PORT
   ```

3. **Multiple Origins**: For production, you can modify `app.js` to include your production frontend URL.

4. **Restart Server**: After changing CORS configuration, restart your Express server.

---

## 1. ADMIN ENDPOINTS (Require Authorization)

### 1.1 Create Form
**Endpoint**: `POST /api/auth/createQueryForm-title`  
**Auth**: Not Required

**cURL Command:**
```bash
curl -X POST http://localhost:5000/api/auth/createQueryForm-title \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Contact Form",
    "description": "A simple contact form"
  }'
```

**Response:**
```json
{
  "status": true,
  "message": "Form created successfully",
  "data": {
    "_id": "form_id_here",
    "title": "Contact Form",
    "description": "A simple contact form",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**React Implementation:**
```javascript
// services/api.js
const API_BASE_URL = 'http://localhost:5000/api/auth';

export const createForm = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/createQueryForm-title`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  return response.json();
};

// Component usage
import { createForm } from './services/api';

const CreateFormComponent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createForm({ title, description });
      if (result.status) {
        console.log('Form created:', result.data);
        // Handle success
      }
    } catch (error) {
      console.error('Error creating form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Form Title"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Form Description"
      />
      <button type="submit">Create Form</button>
    </form>
  );
};
```

---

### 1.2 Create Field
**Endpoint**: `POST /api/auth/forms/:formId/fields`  
**Auth**: Not Required

**cURL Command:**
```bash
curl -X POST http://localhost:5000/api/auth/forms/FORM_ID_HERE/fields \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Full Name",
    "name": "fullName",
    "type": "text",
    "required": true,
    "validation": {
      "min": 2,
      "max": 50
    }
  }'
```

**For Radio/Select/Checkbox fields:**
```bash
curl -X POST http://localhost:5000/api/auth/forms/FORM_ID_HERE/fields \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Gender",
    "name": "gender",
    "type": "radio",
    "required": true,
    "options": [
      { "value": "male", "label": "Male", "order": 0 },
      { "value": "female", "label": "Female", "order": 1 },
      { "value": "other", "label": "Other", "order": 2 }
    ]
  }'
```

**Response:**
```json
{
  "status": true,
  "message": "Field created successfully",
  "data": {
    "_id": "field_id_here",
    "formId": "form_id_here",
    "label": "Full Name",
    "name": "fullName",
    "type": "text",
    "required": true,
    "order": 1
  }
}
```

**React Implementation:**
```javascript
// services/api.js
export const createField = async (formId, fieldData) => {
  const response = await fetch(`${API_BASE_URL}/forms/${formId}/fields`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fieldData),
  });
  return response.json();
};

// Component usage
const CreateFieldComponent = ({ formId }) => {
  const [fieldData, setFieldData] = useState({
    label: '',
    name: '',
    type: 'text',
    required: false,
    options: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createField(formId, fieldData);
      if (result.status) {
        console.log('Field created:', result.data);
      }
    } catch (error) {
      console.error('Error creating field:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={fieldData.label}
        onChange={(e) => setFieldData({...fieldData, label: e.target.value})}
        placeholder="Field Label"
        required
      />
      <input
        type="text"
        value={fieldData.name}
        onChange={(e) => setFieldData({...fieldData, name: e.target.value})}
        placeholder="Field Name"
        required
      />
      <select
        value={fieldData.type}
        onChange={(e) => setFieldData({...fieldData, type: e.target.value})}
      >
        <option value="text">Text</option>
        <option value="textarea">Textarea</option>
        <option value="number">Number</option>
        <option value="email">Email</option>
        <option value="date">Date</option>
        <option value="radio">Radio</option>
        <option value="select">Select</option>
        <option value="checkbox">Checkbox</option>
      </select>
      <button type="submit">Create Field</button>
    </form>
  );
};
```

---

### 1.3 List Forms (Admin)
**Endpoint**: `GET /api/auth/admin/Forms`  
**Auth**: Required (Bearer Token)

**cURL Command:**
```bash
curl -X GET http://localhost:5000/api/auth/admin/Forms \
  -H "Authorization: Bearer secret_token_123@_123@"
```

**Response:**
```json
{
  "status": true,
  "message": "Forms fetched successfully",
  "data": [
    {
      "_id": "form_id_1",
      "title": "Contact Form",
      "description": "A simple contact form",
      "isArchive": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**React Implementation:**
```javascript
// services/api.js
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken'); // or from your auth context
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const listFormsAdmin = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/Forms`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return response.json();
};

// Component usage
const FormsListComponent = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const result = await listFormsAdmin();
        if (result.status) {
          setForms(result.data);
        }
      } catch (error) {
        console.error('Error fetching forms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {forms.map(form => (
        <div key={form._id}>
          <h3>{form.title}</h3>
          <p>{form.description}</p>
        </div>
      ))}
    </div>
  );
};
```

---

### 1.4 Get Fields by Form ID
**Endpoint**: `GET /api/auth/admin/formsFields?formId=FORM_ID`  
**Auth**: Required (Bearer Token)

**cURL Command:**
```bash
curl -X GET "http://localhost:5000/api/auth/admin/formsFields?formId=FORM_ID_HERE" \
  -H "Authorization: Bearer secret_token_123@_123@"
```

**Response:**
```json
{
  "status": true,
  "message": "Fields fetched successfully",
  "data": [
    {
      "_id": "field_id_1",
      "formId": "form_id_here",
      "label": "Full Name",
      "name": "fullName",
      "type": "text",
      "required": true,
      "order": 1
    }
  ]
}
```

**React Implementation:**
```javascript
// services/api.js
export const getFieldsByFormId = async (formId) => {
  const response = await fetch(`${API_BASE_URL}/admin/formsFields?formId=${formId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return response.json();
};

// Component usage
const FormFieldsComponent = ({ formId }) => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const result = await getFieldsByFormId(formId);
        if (result.status) {
          setFields(result.data);
        }
      } catch (error) {
        console.error('Error fetching fields:', error);
      }
    };
    fetchFields();
  }, [formId]);

  return (
    <div>
      {fields.map(field => (
        <div key={field._id}>
          <label>{field.label} {field.required && '*'}</label>
          {/* Render input based on field.type */}
        </div>
      ))}
    </div>
  );
};
```

---

### 1.5 Update Form
**Endpoint**: `PUT /api/auth/admin/UpdateForm?formId=FORM_ID`  
**Auth**: Required (Bearer Token)

**cURL Command:**
```bash
curl -X PUT "http://localhost:5000/api/auth/admin/UpdateForm?formId=FORM_ID_HERE" \
  -H "Authorization: Bearer secret_token_123@_123@" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Form Title",
    "description": "Updated description",
    "isArchive": false
  }'
```

**Response:**
```json
{
  "status": true,
  "message": "Form updated successfully",
  "data": {
    "_id": "form_id_here",
    "title": "Updated Form Title",
    "description": "Updated description",
    "isArchive": false
  }
}
```

**React Implementation:**
```javascript
// services/api.js
export const updateForm = async (formId, updateData) => {
  const response = await fetch(`${API_BASE_URL}/admin/UpdateForm?formId=${formId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });
  return response.json();
};

// Component usage
const UpdateFormComponent = ({ formId, formData }) => {
  const [form, setForm] = useState(formData);

  const handleUpdate = async () => {
    try {
      const result = await updateForm(formId, form);
      if (result.status) {
        console.log('Form updated:', result.data);
      }
    } catch (error) {
      console.error('Error updating form:', error);
    }
  };

  return (
    <div>
      <input
        value={form.title}
        onChange={(e) => setForm({...form, title: e.target.value})}
      />
      <button onClick={handleUpdate}>Update Form</button>
    </div>
  );
};
```

---

### 1.6 Update Field
**Endpoint**: `PATCH /api/auth/admin/fields/:fieldId`  
**Auth**: Required (Bearer Token)

**cURL Command:**
```bash
curl -X PATCH http://localhost:5000/api/auth/admin/fields/FIELD_ID_HERE \
  -H "Authorization: Bearer secret_token_123@_123@" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Updated Label",
    "required": true
  }'
```

**Response:**
```json
{
  "status": true,
  "message": "Field updated successfully",
  "data": {
    "_id": "field_id_here",
    "label": "Updated Label",
    "required": true
  }
}
```

**React Implementation:**
```javascript
// services/api.js
export const updateField = async (fieldId, updateData) => {
  const response = await fetch(`${API_BASE_URL}/admin/fields/${fieldId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });
  return response.json();
};
```

---

### 1.7 Delete Field
**Endpoint**: `DELETE /api/auth/admin/fields/:fieldId`  
**Auth**: Required (Bearer Token)

**cURL Command:**
```bash
curl -X DELETE http://localhost:5000/api/auth/admin/fields/FIELD_ID_HERE \
  -H "Authorization: Bearer secret_token_123@_123@"
```

**Response:**
```json
{
  "status": true,
  "message": "Field deleted successfully"
}
```

**React Implementation:**
```javascript
// services/api.js
export const deleteField = async (fieldId) => {
  const response = await fetch(`${API_BASE_URL}/admin/fields/${fieldId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response.json();
};
```

---

### 1.8 Reorder Fields
**Endpoint**: `PUT /api/auth/admin/forms/:formId/fields/reorder`  
**Auth**: Required (Bearer Token)

**cURL Command:**
```bash
curl -X PUT http://localhost:5000/api/auth/admin/forms/FORM_ID_HERE/fields/reorder \
  -H "Authorization: Bearer secret_token_123@_123@" \
  -H "Content-Type: application/json" \
  -d '{
    "fieldsOrder": [
      { "fieldId": "field_id_1", "order": 1 },
      { "fieldId": "field_id_2", "order": 2 },
      { "fieldId": "field_id_3", "order": 3 }
    ]
  }'
```

**Response:**
```json
{
  "status": true,
  "message": "Fields reordered successfully"
}
```

**React Implementation:**
```javascript
// services/api.js
export const reorderFields = async (formId, fieldsOrder) => {
  const response = await fetch(`${API_BASE_URL}/admin/forms/${formId}/fields/reorder`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ fieldsOrder }),
  });
  return response.json();
};
```

---

### 1.9 Delete Form
**Endpoint**: `DELETE /api/auth/admin/Deleteform?formId=FORM_ID`  
**Auth**: Required (Bearer Token)

**cURL Command:**
```bash
curl -X DELETE "http://localhost:5000/api/auth/admin/Deleteform?formId=FORM_ID_HERE" \
  -H "Authorization: Bearer secret_token_123@_123@"
```

**Response:**
```json
{
  "status": true,
  "message": "Form deleted successfully"
}
```

**Note**: Form cannot be deleted if it has submissions. Archive it instead.

**React Implementation:**
```javascript
// services/api.js
export const deleteForm = async (formId) => {
  const response = await fetch(`${API_BASE_URL}/admin/Deleteform?formId=${formId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response.json();
};
```

---

## 2. SUBMISSION ENDPOINTS (Require Authorization)

### 2.1 Submit Form
**Endpoint**: `POST /api/auth/forms/:formId/submit`  
**Auth**: Required (Bearer Token)

**cURL Command:**
```bash
curl -X POST http://localhost:5000/api/auth/forms/FORM_ID_HERE/submit \
  -H "Authorization: Bearer secret_token_123@_123@" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": {
      "fullName": "John Doe",
      "email": "john@example.com",
      "age": 30,
      "gender": "male"
    }
  }'
```

**Response:**
```json
{
  "status": true,
  "message": "Form submitted successfully"
}
```

**Error Response (Validation Failed):**
```json
{
  "status": false,
  "message": "Validation failed",
  "errors": {
    "fullName": "This field is required.",
    "age": "Minimum value is 18."
  }
}
```

**React Implementation:**
```javascript
// services/api.js
export const submitForm = async (formId, answers) => {
  const response = await fetch(`${API_BASE_URL}/forms/${formId}/submit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ answers }),
  });
  return response.json();
};

// Component usage
const FormSubmissionComponent = ({ formId, fields }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (fieldName, value) => {
    setFormData({...formData, [fieldName]: value});
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors({...errors, [fieldName]: null});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await submitForm(formId, formData);
      if (result.status) {
        alert('Form submitted successfully!');
        setFormData({});
      } else if (result.errors) {
        setErrors(result.errors);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map(field => (
        <div key={field._id}>
          <label>
            {field.label} {field.required && '*'}
          </label>
          {field.type === 'text' && (
            <input
              type="text"
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
          )}
          {field.type === 'radio' && field.options?.map(option => (
            <label key={option.value}>
              <input
                type="radio"
                name={field.name}
                value={option.value}
                checked={formData[field.name] === option.value}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
              />
              {option.label}
            </label>
          ))}
          {errors[field.name] && (
            <span className="error">{errors[field.name]}</span>
          )}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};
```

---

### 2.2 List Submissions
**Endpoint**: `GET /api/auth/forms/:formId/listSubmissions?page=1&limit=10`  
**Auth**: Required (Bearer Token)

**cURL Command:**
```bash
curl -X GET "http://localhost:5000/api/auth/forms/FORM_ID_HERE/listSubmissions?page=1&limit=10" \
  -H "Authorization: Bearer secret_token_123@_123@"
```

**Response:**
```json
{
  "status": true,
  "message": "Submissions fetched successfully",
  "pagination": {
    "total": 50,
    "page": 1,
    "totalPages": 5
  },
  "data": [
    {
      "_id": "submission_id_1",
      "formId": "form_id_here",
      "answers": {
        "fullName": "John Doe",
        "email": "john@example.com"
      },
      "meta": {
        "ip": "127.0.0.1",
        "userAgent": "Mozilla/5.0..."
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**React Implementation:**
```javascript
// services/api.js
export const listSubmissions = async (formId, page = 1, limit = 10) => {
  const response = await fetch(
    `${API_BASE_URL}/forms/${formId}/listSubmissions?page=${page}&limit=${limit}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );
  return response.json();
};

// Component usage
const SubmissionsListComponent = ({ formId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async (page) => {
    setLoading(true);
    try {
      const result = await listSubmissions(formId, page, 10);
      if (result.status) {
        setSubmissions(result.data);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(1);
  }, [formId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {submissions.map(submission => (
        <div key={submission._id}>
          <h4>Submission {submission._id}</h4>
          <pre>{JSON.stringify(submission.answers, null, 2)}</pre>
          <p>Submitted: {new Date(submission.createdAt).toLocaleString()}</p>
        </div>
      ))}
      <div>
        <button
          disabled={pagination.page === 1}
          onClick={() => fetchSubmissions(pagination.page - 1)}
        >
          Previous
        </button>
        <span>Page {pagination.page} of {pagination.totalPages}</span>
        <button
          disabled={pagination.page === pagination.totalPages}
          onClick={() => fetchSubmissions(pagination.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};
```

---

## 3. PUBLIC ENDPOINTS (No Authorization Required)

### 3.1 List Public Forms
**Endpoint**: `GET /api/auth/users/forms`

**cURL Command:**
```bash
curl -X GET http://localhost:5000/api/auth/users/forms
```

**Response:**
```json
{
  "status": true,
  "message": "Forms fetched successfully",
  "data": [
    {
      "_id": "form_id_1",
      "title": "Contact Form",
      "description": "A simple contact form",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**React Implementation:**
```javascript
// services/api.js
export const listFormsPublic = async () => {
  const response = await fetch(`${API_BASE_URL}/users/forms`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

// Component usage
const PublicFormsListComponent = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const result = await listFormsPublic();
        if (result.status) {
          setForms(result.data);
        }
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };
    fetchForms();
  }, []);

  return (
    <div>
      {forms.map(form => (
        <div key={form._id}>
          <h3>{form.title}</h3>
          <p>{form.description}</p>
          <a href={`/form/${form._id}`}>View Form</a>
        </div>
      ))}
    </div>
  );
};
```

---

### 3.2 Get Form Definition
**Endpoint**: `GET /api/auth/user/forms/:formId`

**cURL Command:**
```bash
curl -X GET http://localhost:5000/api/auth/user/forms/FORM_ID_HERE
```

**Response:**
```json
{
  "status": true,
  "message": "Form definition fetched successfully",
  "data": {
    "form": {
      "_id": "form_id_here",
      "title": "Contact Form",
      "description": "A simple contact form",
      "isArchive": false
    },
    "fields": [
      {
        "_id": "field_id_1",
        "formId": "form_id_here",
        "label": "Full Name",
        "name": "fullName",
        "type": "text",
        "required": true,
        "order": 1
      }
    ]
  }
}
```

**React Implementation:**
```javascript
// services/api.js
export const getFormDefinition = async (formId) => {
  const response = await fetch(`${API_BASE_URL}/user/forms/${formId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

// Component usage
const FormViewComponent = ({ formId }) => {
  const [form, setForm] = useState(null);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const result = await getFormDefinition(formId);
        if (result.status) {
          setForm(result.data.form);
          setFields(result.data.fields);
        }
      } catch (error) {
        console.error('Error fetching form:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [formId]);

  if (loading) return <div>Loading...</div>;
  if (!form) return <div>Form not found</div>;

  return (
    <div>
      <h1>{form.title}</h1>
      <p>{form.description}</p>
      {/* Render form fields dynamically */}
      {fields.map(field => (
        <div key={field._id}>
          <label>{field.label} {field.required && '*'}</label>
          {/* Render appropriate input based on field.type */}
        </div>
      ))}
    </div>
  );
};
```

---

## Complete React Setup Guide

### Step 1: Create API Service File
Create `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api/auth';

// Helper function for auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken'); // or from your auth context
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Public endpoints
export const listFormsPublic = async () => {
  const response = await fetch(`${API_BASE_URL}/users/forms`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
};

export const getFormDefinition = async (formId) => {
  const response = await fetch(`${API_BASE_URL}/user/forms/${formId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
};

// Admin endpoints (no auth required for create)
export const createForm = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/createQueryForm-title`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  return response.json();
};

export const createField = async (formId, fieldData) => {
  const response = await fetch(`${API_BASE_URL}/forms/${formId}/fields`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fieldData),
  });
  return response.json();
};

// Admin endpoints (auth required)
export const listFormsAdmin = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/Forms`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const getFieldsByFormId = async (formId) => {
  const response = await fetch(`${API_BASE_URL}/admin/formsFields?formId=${formId}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const updateForm = async (formId, updateData) => {
  const response = await fetch(`${API_BASE_URL}/admin/UpdateForm?formId=${formId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });
  return response.json();
};

export const updateField = async (fieldId, updateData) => {
  const response = await fetch(`${API_BASE_URL}/admin/fields/${fieldId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });
  return response.json();
};

export const deleteField = async (fieldId) => {
  const response = await fetch(`${API_BASE_URL}/admin/fields/${fieldId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const deleteForm = async (formId) => {
  const response = await fetch(`${API_BASE_URL}/admin/Deleteform?formId=${formId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return response.json();
};

export const reorderFields = async (formId, fieldsOrder) => {
  const response = await fetch(`${API_BASE_URL}/admin/forms/${formId}/fields/reorder`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ fieldsOrder }),
  });
  return response.json();
};

// Submission endpoints
export const submitForm = async (formId, answers) => {
  const response = await fetch(`${API_BASE_URL}/forms/${formId}/submit`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ answers }),
  });
  return response.json();
};

export const listSubmissions = async (formId, page = 1, limit = 10) => {
  const response = await fetch(
    `${API_BASE_URL}/forms/${formId}/listSubmissions?page=${page}&limit=${limit}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );
  return response.json();
};
```

### Step 2: Create Auth Context (Optional but Recommended)
Create `src/contexts/AuthContext.jsx`:

```javascript
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem('adminToken') || null
  );

  const login = (token) => {
    setAdminToken(token);
    localStorage.setItem('adminToken', token);
  };

  const logout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
  };

  return (
    <AuthContext.Provider value={{ adminToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### Step 3: Update API Service to Use Auth Context
Modify `src/services/api.js` to use the auth context:

```javascript
// You'll need to pass token or use a global state management solution
// For simplicity, using localStorage directly in the service file
```

### Step 4: Create Form Builder Component
Create `src/components/FormBuilder.jsx`:

```javascript
import { useState, useEffect } from 'react';
import { createForm, createField, getFieldsByFormId } from '../services/api';

const FormBuilder = () => {
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formId, setFormId] = useState(null);
  const [fields, setFields] = useState([]);
  const [newField, setNewField] = useState({
    label: '',
    name: '',
    type: 'text',
    required: false,
    options: []
  });

  const handleCreateForm = async () => {
    const result = await createForm({
      title: formTitle,
      description: formDescription
    });
    if (result.status) {
      setFormId(result.data._id);
      alert('Form created! Now add fields.');
    }
  };

  const handleAddField = async () => {
    if (!formId) {
      alert('Please create a form first');
      return;
    }
    const result = await createField(formId, newField);
    if (result.status) {
      setFields([...fields, result.data]);
      setNewField({ label: '', name: '', type: 'text', required: false, options: [] });
    }
  };

  return (
    <div>
      <h2>Create Form</h2>
      <input
        placeholder="Form Title"
        value={formTitle}
        onChange={(e) => setFormTitle(e.target.value)}
      />
      <textarea
        placeholder="Form Description"
        value={formDescription}
        onChange={(e) => setFormDescription(e.target.value)}
      />
      <button onClick={handleCreateForm}>Create Form</button>

      {formId && (
        <div>
          <h3>Add Fields</h3>
          <input
            placeholder="Field Label"
            value={newField.label}
            onChange={(e) => setNewField({...newField, label: e.target.value})}
          />
          <input
            placeholder="Field Name"
            value={newField.name}
            onChange={(e) => setNewField({...newField, name: e.target.value})}
          />
          <select
            value={newField.type}
            onChange={(e) => setNewField({...newField, type: e.target.value})}
          >
            <option value="text">Text</option>
            <option value="textarea">Textarea</option>
            <option value="number">Number</option>
            <option value="email">Email</option>
            <option value="date">Date</option>
            <option value="radio">Radio</option>
            <option value="select">Select</option>
            <option value="checkbox">Checkbox</option>
          </select>
          <button onClick={handleAddField}>Add Field</button>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
```

### Step 5: Create Form Renderer Component
Create `src/components/FormRenderer.jsx`:

```javascript
import { useState } from 'react';
import { submitForm } from '../services/api';

const FormRenderer = ({ form, fields }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (fieldName, value) => {
    setFormData({...formData, [fieldName]: value});
    if (errors[fieldName]) {
      setErrors({...errors, [fieldName]: null});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await submitForm(form._id, formData);
    if (result.status) {
      alert('Form submitted successfully!');
      setFormData({});
    } else if (result.errors) {
      setErrors(result.errors);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'date':
        return (
          <input
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
          />
        );
      case 'textarea':
        return (
          <textarea
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
          />
        );
      case 'radio':
        return (
          <div>
            {field.options?.map(option => (
              <label key={option.value}>
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={formData[field.name] === option.value}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  required={field.required}
                />
                {option.label}
              </label>
            ))}
          </div>
        );
      case 'select':
        return (
          <select
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            required={field.required}
          >
            <option value="">Select...</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{form.title}</h1>
      {form.description && <p>{form.description}</p>}
      
      {fields.map(field => (
        <div key={field._id}>
          <label>
            {field.label} {field.required && '*'}
          </label>
          {renderField(field)}
          {errors[field.name] && (
            <span style={{ color: 'red' }}>{errors[field.name]}</span>
          )}
        </div>
      ))}
      
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormRenderer;
```

### Step 6: Install Dependencies (if needed)
```bash
npm install axios  # Optional: if you prefer axios over fetch
```

### Step 7: Usage Example in App.jsx
```javascript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import FormBuilder from './components/FormBuilder';
import FormRenderer from './components/FormRenderer';
import { getFormDefinition } from './services/api';
import { useState, useEffect } from 'react';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/form-builder" element={<FormBuilder />} />
          <Route path="/form/:formId" element={<FormView />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

const FormView = () => {
  const [form, setForm] = useState(null);
  const [fields, setFields] = useState([]);
  const formId = window.location.pathname.split('/')[2];

  useEffect(() => {
    const fetchForm = async () => {
      const result = await getFormDefinition(formId);
      if (result.status) {
        setForm(result.data.form);
        setFields(result.data.fields);
      }
    };
    fetchForm();
  }, [formId]);

  if (!form) return <div>Loading...</div>;
  return <FormRenderer form={form} fields={fields} />;
}

export default App;
```

---

## Field Types Reference

- **text**: Single-line text input
- **textarea**: Multi-line text input
- **number**: Numeric input
- **email**: Email input with validation
- **date**: Date picker
- **radio**: Radio button group (requires options)
- **select**: Dropdown select (requires options)
- **checkbox**: Checkbox (requires options)

---

## Error Handling Best Practices

```javascript
const handleApiError = (error, result) => {
  if (!result.status) {
    if (result.errors) {
      return result.errors;
    } else {
      alert(result.message || 'An error occurred');
    }
  }
  return null;
};

// Usage------------->
const result = await submitForm(formId, formData);
const errors = handleApiError(null, result);
if (errors) {
  setFormErrors(errors);
}
```

---

## Notes

1. **Port Configuration**: Make sure your Express server is running on the correct port (default: 5000, fallback: 3000)
2. **CORS**: If your React app runs on a different port, you may need to configure CORS in your Express app
3. **Admin Token**: Store the admin token securely (localStorage for demo, secure storage for production)
4. **Error Handling**: Always handle errors and show user-friendly messages
5. **Loading States**: Show loading indicators during API calls
6. **Form Validation**: Client-side validation is recommended, but server validation is the source of truth

---

## Quick Start Checklist

- [ ] Set up React project (`npx create-react-app` or Vite)
- [ ] Create `src/services/api.js` with all API functions
- [ ] Create `src/contexts/AuthContext.jsx` for auth management
- [ ] Create form builder component
- [ ] Create form renderer component
- [ ] Set up routing (React Router)
- [ ] Test all endpoints with curl commands first
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Style your components

---

**End of Documentation**

