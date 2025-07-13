import React from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import { getImgUrl } from '../../utils/getImgUrl'
import { Link, useNavigate } from'react-router-dom'
import { useDispatch } from'react-redux'
import { addToCart } from '../../redux/features/cart/cartSlice'
import Swal from 'sweetalert2'

const BookCard = ({book}) => {
     const dispatch = useDispatch();
     const navigate = useNavigate();

    const handleAddToCart = (product) => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        
        if (!token) {
            // User is not logged in, show login prompt
            Swal.fire({
                title: "Login Required",
                text: "Please login to add items to your cart",
                icon: "info",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#6c757d",
                confirmButtonText: "Login Now",
                cancelButtonText: "Cancel"
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }
        
        // User is logged in, proceed with adding to cart
        dispatch(addToCart(product))
    }
    
    return (
        <div className=" rounded-lg transition-shadow duration-300">
            <div
                className="flex flex-col sm:flex-row sm:items-center sm:h-72  sm:justify-center gap-4"
            >
                <div className="sm:h-72 sm:flex-shrink-0 border rounded-md">
                    <Link to={`/books/${book._id}`}>
                        <img
                            src={`${getImgUrl(book?.imageLink)}`}
                            alt=""
                            className="w-full bg-cover p-2 rounded-md cursor-pointer hover:scale-105 transition-all duration-200"
                        />
                    </Link>
                </div>

                <div>
                    <Link to={`/books/${book._id}`}>
                        <h3 className="text-xl font-semibold hover:text-blue-600 mb-3">
                       {book?.title}
                        </h3>
                    </Link>
                    <p className="text-gray-600 mb-5">{book?.description?.length > 80 ? `${book.description?.slice(0, 80)}...` : book?.description }</p>
                    <p className="text-gray-600 mb-5">By {book.author}</p>
                    <p className="font-medium mb-5">
                        ${book?.new_price} <span className="line-through font-normal ml-2">$ {book?.old_price}</span>
                    </p>
                    <button 
                    onClick={() => handleAddToCart(book)}
                    className="btn-primary px-6 space-x-1 flex items-center gap-1 ">
                        <FiShoppingCart className="" />
                        <span>Add to Cart</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BookCard