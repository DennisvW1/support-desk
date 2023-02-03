import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Modal from 'react-modal'
import { useSelector, useDispatch } from 'react-redux'
import { getTicket, reset, closeTicket } from '../features/tickets/ticketSlice'
import { useParams, useNavigate } from 'react-router-dom'
import BackButton from '../components/BackButton'
import Spinner from '../components/Spinner'

const customStyles = {
    content: {
        width: '600px',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        position: 'relative',
    },
}

Modal.setAppElement('#root')

function Ticket() {
    const { ticket, isLoading, isSuccess, isError, message } = useSelector((state) => state.ticket)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { ticketId } = useParams();

    useEffect(() => {
        if (isError) {
            toast.error(message)
        }

        dispatch(getTicket(ticketId))

    }, [isError, message, ticketId, dispatch])

    if (isLoading) {
        return <Spinner />
    }

    if (isError) {
        return <h3>Something went wrong...</h3>
    }

    const onTicketClose = () => {
        dispatch(closeTicket(ticketId))
        toast.success("Ticket closed")
        navigate("/tickets")
    }

    return (
        <div className='ticket-page'>
            <header className='ticket-header'>
                <BackButton />
                <h2>
                    Ticket ID: {ticket._id}
                    <span className={`status status-${ticket.status}`}>
                        {ticket.status}
                    </span>
                </h2>
                <h3>
                    Date Submitted: {new Date(ticket.createdAt).toLocaleString('en-US')}
                </h3>
                <h3>Product: {ticket.product}</h3>
                <hr />
                <div className='ticket-desc'>
                    <h3>Description of Issue</h3>
                    <p>{ticket.description}</p>
                </div>
            </header>

            {ticket.status !== 'closed' && (
                <button onClick={onTicketClose} className='btn btn-block btn-danger'>
                    Close Ticket
                </button>
            )}
        </div>
    )
}

export default Ticket