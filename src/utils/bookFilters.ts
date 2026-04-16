import type { Book } from "../types/interface/book.types"

export const filterBooks=(

books:Book[],
search:string,
category:string

)=>{

return books.filter(b=>{

return(

b.title.toLowerCase().includes(search.toLowerCase()) &&
(category==="All" || b.category===category)

)

})

}