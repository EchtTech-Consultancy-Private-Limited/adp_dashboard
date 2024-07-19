import React from 'react';
import Header from '../components/Header/Header';

export default function ScreenReader() {
   
    return (
        <>
            <section className='internal-banner-bg pb-4'>
                <div className="container pb-2">
                    <Header />
                </div>
            </section>
            <section className="bg-grey ptb-70" id='content'>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-left">
                            <h2 className="heading-sm">Screen Reader Access</h2>
                            <p className="desc-black">
                                The ADP Dashboard complies with Guidelines for Indian Government Websites and World Wide Web Consortium (W3C) Web Content Accessibility Guidelines (WCAG) 2.0 level A. This will enable people with visual impairments access the website using technologies, such as screen readers. The information of the website is accessible with different screen readers, such as JAWS, NVDA, SAFA, Supernova and Window-Eyes.
                            </p>
                            <p className="desc-black">
                                Following table lists the information about different screen readers : Information related to the various screen readers
                            </p>

                            <div className="screentable table-responsive mt-2">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Sr.No.</th>
                                            <th scope="col">Screen Reader</th>
                                            <th scope="col">Website</th>
                                            <th scope="col">Free/Commercial</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>1</td>
                                            <td>Non Visual Desktop Access (NVDA)</td>
                                            <td><a href="http://www.nvda-project.org/" target='_blank' title="External site that opens in a new window">http://www.nvda-project.org/</a>
                                                <br />
                                                (External website that opens in a new window)
                                            </td>
                                            <td>Free</td>
                                        </tr>
                                        <tr>
                                            <td>2</td>
                                            <td>System Access To Go</td>
                                            <td>
                                                <a href="http://www.satogo.com/" target="_blank" title="External site that opens in a new window">http://www.satogo.com/</a><br />(External website that opens in a new window)
                                            </td>
                                            <td>Free</td>
                                        </tr>
                                        <tr>
                                            <td>3</td>
                                            <td>Web Anywhere</td>
                                            <td>
                                                <a href="http://webanywhere.cs.washington.edu/wa.php" target="_BLANK" title="External site that opens in a new window">http://webanywhere.cs.washington.edu/wa.php</a>
                                                <br />(External website that opens in a new window)
                                            </td>
                                            <td>Free</td>
                                        </tr>
                                        <tr>
                                            <td>4</td>
                                            <td>Hal</td>
                                            <td>
                                                <a href="http://www.yourdolphin.co.uk/productdetail.asp?id=5" target="_BLANK" title="External site that opens in a new window">http://www.yourdolphin.co.uk/productdetail.asp?id=5</a>
                                                <br />(External website that opens in a new window)
                                            </td>
                                            <td>Commercial</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
