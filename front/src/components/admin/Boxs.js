import React from 'react'

const Box = () => {
  return (
    <div className="row">
    <div className="col-md-6 mb-4">

        {/* <!-- Illustrations --> */}
        <div className="card shadow mb-4">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Illustrations</h6>
            </div>
            <div className="card-body">
                <div className="text-center">
                    <img className="img-fluid px-3 px-sm-4 mt-3 mb-4 a6"
                        src="../../img/undraw_posting_photo.svg" alt="..." />
                </div>
                <p>Add some quality, svg illustrations to your project courtesy of <a
                    target="_blank" rel="nofollow" href="https://undraw.co/">unDraw</a>, a
                    constantly updated collection of beautiful svg images that you can use
                    completely free and without attribution!</p>
                <a target="_blank" rel="nofollow" href="https://undraw.co/">Browse Illustrations on
                    unDraw &rarr;</a>
            </div>
        </div>

       

    </div>
    <div className='col-md-6 mb-4'>
         {/* <!-- Approach --> */}
        <div className="card shadow mb-5">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Development Approach</h6>
            </div>
            <div className="card-body">
                <p>SB Admin 2 makes extensive use of Bootstrap 4 utility classNamees in order to reduce
                    CSS bloat and poor page performance. Custom CSS classNamees are used to create
                    custom components and custom utility classNamees.</p>
                <p className="mb-0">Before working with this theme, you should become familiar with the
                    Bootstrap framework, especially the utility classNamees.</p>
            </div>
        </div>
        <div className="card shadow ">
            <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Development Approach</h6>
            </div>
            <div className="card-body">
                <p>SB Admin 2 makes extensive use of Bootstrap 4 utility classNamees in order to reduce
                    CSS bloat and poor page performance. Custom CSS classNamees are used to create
                    custom components and custom utility classNamees.</p>
                <p className="mb-0">Before working with this theme, you should become familiar with the
                    Bootstrap framework, especially the utility classNamees.</p>
            </div>
        </div>
    </div>
    
</div>
  )
}

export default Box