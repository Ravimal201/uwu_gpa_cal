function SubjectRow({ index, subject, updateSubject, removeSubject }) {
  return (
    <tr>
      <td>
        <input
          type="text"
          value={subject.subject}
          placeholder="Subject Name"
          onChange={(e) => updateSubject(index, "subject", e.target.value)}
        />
      </td>

      <td>
        <input
          type="number"
          value={subject.credits}
          placeholder="Credits"
          onChange={(e) => updateSubject(index, "credits", e.target.value)}
        />
      </td>

      <td>
        <input
          type="number"
          value={subject.marks}
          placeholder="Marks"
          onChange={(e) => updateSubject(index, "marks", e.target.value)}
        />
      </td>

      <td>
        <button onClick={() => removeSubject(index)}>Delete</button>
      </td>
    </tr>
  );
}

export default SubjectRow;
