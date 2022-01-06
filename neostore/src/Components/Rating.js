import React from 'react'

export default function Rating({ count }) {
    return (
        <div className='m-2'>
            {
                [1, 2, 3, 4, 5].map((i) => {
                    if (count >= i) {
                        return <i key={i} className="bi bi-star-fill text-info m-1"></i>
                    }
                    else {
                        return <i key={i} className="bi bi-star text-info m-1"></i>
                    }
                }
                )
            }
        </div>
    )
}
