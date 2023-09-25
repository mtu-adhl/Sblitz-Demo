import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import React, { FormEvent, useRef, useState } from "react";
import {
  Button,
  Form,
  InputGroup,
  Modal,
  Overlay,
  Row,
  Tooltip,
} from "react-bootstrap";
import { HiUserAdd } from "react-icons/hi";
import { auth, db } from "../FirebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

interface Props {
  allLists: string[];
  allMembers: string[];
  setAllMembers: (params?: any) => void;
  setSelectedList: (params?: any) => void;
}

const CreateList = ({ allLists, setAllMembers, setSelectedList }: Props) => {
  const [show, setShow] = useState(false);
  const [listName, setListName] = useState("");
  const [validated, setValidated] = useState(false);
  const [member, setMember] = useState("");
  const [membersList, setMembersList] = useState<string[]>([]);
  const [user] = useAuthState(auth);

  const handleShow = () => {
    setShow((curr) => !curr);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDoc(doc(db, user!.uid, listName), {});
    const membersRef = collection(db, user!.uid, listName, "Members");
    membersList.forEach((m) => {
      addDoc(membersRef, {
        name: m,
        balance: 0,
        email: "",
      });
    });

    setSelectedList(listName);
    setAllMembers(membersList);
    handleShow();
  };

  const handleAddMember = (e: React.MouseEvent<HTMLButtonElement>) => {
    setMembersList((curr) => [...curr, member]);
    setMember("");
  };
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Create List
      </Button>

      <Modal show={show} onHide={handleShow} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Create New List</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex-inline">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Label>Name</Form.Label>
            <InputGroup hasValidation className="mb-3">
              <Form.Control
                type="text"
                value={listName}
                isInvalid={allLists.includes(listName)}
                onChange={(e) => setListName(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                {listName} already exists.
              </Form.Control.Feedback>
            </InputGroup>

            <Form.Label>Members</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                type="text"
                value={member}
                onChange={(e) => {
                  setMember(e.target.value);
                }}
              />
              <Button onClick={handleAddMember}>
                <HiUserAdd></HiUserAdd>
              </Button>
            </InputGroup>
            <ul>
              {membersList.map((m) => {
                return <li key={m}>{m}</li>;
              })}
            </ul>
            <div className="text-end">
              <Button variant="primary" type="submit">
                Create
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateList;
