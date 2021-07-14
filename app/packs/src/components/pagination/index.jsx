import React from "react"

const PreviousButton = ({ prev, url }) => {
  if (prev) {
    url.searchParams.set("page", prev);

    return (
      <li className="page-item">
        <a className="page-link" href={url.toString()}><small>{'\u2190'} Previous</small></a>
      </li>
    )
  } else {
    return (
      <li className="page-item disabled">
        <a className="page-link" href="#" tabIndex="-1" aria-disabled="true"><small>{'\u2190'} Previous</small></a>
      </li>
    )
  }
}

const NextButton = ({ next, url }) => {
  if (next) {
    url.searchParams.set("page", next);

    return (
      <li className="page-item">
        <a className="page-link" href={url.toString()}><small>Next {'\u2192'}</small></a>
      </li>
    )
  } else {
    return (
      <li className="page-item disabled">
        <a className="page-link" href="#" tabIndex="-1" aria-disabled="true"><small>Next {'\u2192'}</small></a>
      </li>
    )
  }
}

const calculatePageArray = (page, last) => {
  if(last <= 6) {
    // 1 until last
    return Array.from({length: last}, (_, i)=> i+1)
  } else {
    if (page < 3 || (last - page) < 3) {
      // 1,2,3 ... last-2,last-1,last
      return [1, 2, 3, null, last-2, last-1, last]
    } else {
      // 1 ... page-1 page page+1 ... last
      return [1, null, page-1, page, page+1, null, last]
    }
  }
}

const PageNumbers = ({ page, last, url }) => {
  const paginationArray = calculatePageArray(page, last)

  return paginationArray.map((page_number, index) => {
    url.searchParams.set("page", page_number);

    if (page_number === null) {
      return (
        <li key={`page-item-disabled-${index}`} className="page-item disabled">
          <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">...</a>
        </li>
      )
    }
    return (
      <li key={`page-item-${page_number}`} className={`page-item${page == page_number ? ' active': ''}`}>
        <a className="page-link" aria-current={page == page_number ? 'page': null} href={url.toString()}>{page_number}</a>
      </li>
    )
  })
}

const Pagination = ({ prev, next, page, last}) => {
  const url = new URL(document.location)

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-between">
        <PreviousButton prev={prev} url={url}/>
        <div className="d-flex flex-row">
          <PageNumbers page={page} last={last} url={url}/>
        </div>
        <NextButton next={next} url={url}/>
      </ul>
    </nav>
  )
}

export default Pagination
