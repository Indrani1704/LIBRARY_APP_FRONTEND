export interface Author {

id:string
name:string
image:string
isClassic?:boolean
isPopular?:boolean

}

export interface Book {

id:string
title:string
description:string
price:number
genre:string
category:string
language:string
publisher:string
image:string
rating:number

author: Author

reviews:any[]

isLatest?:boolean
isBestSeller?:boolean

}