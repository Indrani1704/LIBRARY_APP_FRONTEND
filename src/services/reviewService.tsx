import type { Review } from "../types/interface/review.types"

export const getReviews = (bookId:string) => {

const stored = localStorage.getItem("reviews")

if(!stored) return []

const reviews:Review[] = JSON.parse(stored)

return reviews.filter(r => r.bookId === bookId)

}

export const saveReview = (review:Review) => {

const stored = localStorage.getItem("reviews")

const reviews = stored ? JSON.parse(stored) : []

reviews.push(review)

localStorage.setItem("reviews", JSON.stringify(reviews))

}