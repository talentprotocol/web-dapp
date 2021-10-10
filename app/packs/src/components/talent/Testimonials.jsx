import React, { useState } from "react";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TalentProfilePicture from "./TalentProfilePicture";
import Modal from "react-bootstrap/Modal";
import Button from "../button";
import { post } from "src/utils/requests";

const AddTestimonial = ({ show, hide, saveTestimonial }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const closeModal = (e) => {
    e.preventDefault();
    setTitle('');
    setDescription('');
    hide();
  }

  const save = (e) => {
    e.preventDefault();
    setTitle('');
    setDescription('');
    saveTestimonial(title, description);
  }

  return (
    <Modal show={show} onHide={hide} centered>
      <Modal.Header>
        <Modal.Title>
          Add your testimonial
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="form-group">
            <label className="mr-1 my-2">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write a title"
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="mr-1 my-2">Description</label>
              <textarea
              id="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a description"
              className="form-control"
              style={{ minHeight: 200 }}
            />
          </div>
          <div className="mb-2 d-flex flex-row-reverse align-items-end justify-content-between">
            <Button type="primary" text="Save" onClick={(e) => save(e)} />
            <Button type="secondary" text="Cancel" onClick={(e) => closeModal(e)} />
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
};

const Testimonials = ({
  talentId,
  testimonials,
  width,
  updateTestimonials,
}) => {
  const [start, setStart] = useState(0);
  const [showAddTestimonialModal, setShowAddTestimonialModal] = useState(false);
  const itemsPerRow = width < 768 ? 1 : 3;

  const end = testimonials.length > itemsPerRow ? start + itemsPerRow : testimonials.length;
  const sliceInDisplay = testimonials.slice(start, end);

  const slideLeft = () => setStart((prev) => prev - 1);
  const slideRight = () => setStart((prev) => prev + 1);
  const disableLeft = start === 0;
  const disableRight = start + itemsPerRow >= testimonials.length;

  const saveTestimonial = (title, description) => {
    post("/api/v1/testimonials", { testimonial: {
      title: title,
      description: description,
      talent_id: talentId,
    }}).then((response) => {
      updateTestimonials(response);
      setShowAddTestimonialModal(false);
    })
  }

  return (
    <>
      <div className="d-flex flex-row justify-content-between align-items-center mt-4">
        <div className="d-flex flex-row align-items-center">
          <h5 className="mb-0"><strong>Testimonials</strong></h5>
          <button
            className="btn btn-primary ml-2"
            style={{ height: 38, width: 150 }}
            onClick={() => setShowAddTestimonialModal(true)}
          >
            Add Testimonial
          </button>
        </div>
        <div className="d-flex flex-row">
          <button
            className="btn btn-secondary"
            onClick={slideLeft}
            disabled={disableLeft}
          >
            <FontAwesomeIcon icon={faChevronLeft} size="sm" />
          </button>
          <button
            className="btn btn-secondary ml-2"
            onClick={slideRight}
            disabled={disableRight}
          >
            <FontAwesomeIcon icon={faChevronRight} size="sm" />
          </button>
        </div>
      </div>
      <div className="d-flex justify-content-between mb-2 mt-3">
        {sliceInDisplay.map((testimonial) => (
          <div
            key={`goal_list_${testimonial.id}`}
            className={`bg-light rounded p-3 ${itemsPerRow == 1 ? 'col-12' : 'lg-w-32'}`}
          >
            <div className="d-flex align-items-center">
              <TalentProfilePicture src={testimonial.user.profilePictureUrl} height={24} />
              <h6 className="ml-2 mb-0">{testimonial.user.display_name || testimonial.user.username}</h6>
            </div>
            <div className="mt-4">
              <h6 className="card-title">{testimonial.title}</h6>
            </div>
            <div className="mt-4">
              <small className="card-title">{testimonial.description}</small>
            </div>
          </div>
        ))}
      </div>
      <AddTestimonial
        show={showAddTestimonialModal}
        hide={() => setShowAddTestimonialModal(false)}
        saveTestimonial={saveTestimonial}
      />
    </>
  );
};

export default Testimonials;
