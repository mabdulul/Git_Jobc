import React from "react";
import { useEffect, useState } from "react";
import Header from "./header.jsx";
import useFetchJobs from "./useFetchJobs.js";
import { useParams } from "react-router-dom";
import { getJobDetails } from "./apiFetch";
import LoadingScreen from "./Loading";

import Moment from "react-moment";

import CompanyHolder from "../component/images/icons/company-placeholder.png";

import "./css/Deatils.css";

const JobDeatils = () => {
	let { url } = useParams();
	const [state, dispatch] = useFetchJobs();
	const [applynow, setapplyNow] = useState("");

	useEffect(() => {
		dispatch({ type: "FETCH_LOADING" });
		const fetchJobs = async () => {
			await getJobDetails(url)
				.then((response) => {
					const expression = /<a\s+(?:[^>]*?\s+)?href="([^"]*)"|[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)/;

					let regex = new RegExp(expression);
					const test = response.how_to_apply.match(regex)[1] || " ";

					setapplyNow(test);
					dispatch({ type: `FETCH_SUCCESS`, payload: response });
				})
				.then((res) => {
					return res;
				})
				.catch((error) => dispatch({ type: "FETCH_ERROR" }));
		};
		fetchJobs();

		return () => {
			console.log("removed");
			dispatch({ type: "FETCH_CLEAR" });
		};
	}, [url, dispatch]);

	console.log("here", state.jobs);

	return (
		<>
			<Header />
			<div className='container'>
				{state.loading ? (
					<LoadingScreen />
				) : (
					<>
						{state.loading}
						{state.jobs.length === 0 && state.loading === false ? (
							<p>Something went wrong. Try reloading</p>
						) : (
							<div className='row'>
								<div className='col-sm-12 col-md-12 col-lg-12 Deatils '>
									<div key={state.jobs.id} className='Deatils-Wrapper '>
										<>
											<div className='Deatils-company-wrapper'>
												<div className='Deatils-logo'>
													{!state.jobs.company_logo ? (
														<img
															src={CompanyHolder}
															alt='company-logo'
															className='company-logo'
														/>
													) : (
														<img
															src={state.jobs.company_logo}
															alt='company-logo'
															className='company-logo'
														/>
													)}
												</div>
												<div className='company-name'>
													<p>{state.jobs.company}</p>
													<span>
														{!state.jobs.company_url
															? " "
															: state.jobs.company_url
																	.replace("/", "")
																	.replace("https:/", "")
																	.replace("www.", "")
																	.replace("www.", "")
																	.replace("http:/", "")}
													</span>
												</div>
												<div className='btn-link'>
													{!state.jobs.company_url ? (
														<div>
															<p>No company site</p>
														</div>
													) : !state.jobs.company_url.match(
															/[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)?/
													  ) ? (
														<p>No company site</p>
													) : (
														<a
															href={state.jobs.company_url}
															target='_blank'
															rel='noopener noreferrer'
														>
															Company Site
														</a>
													)}
												</div>
											</div>
										</>
									</div>
									<div className='Description Description-Wrapper'>
										<div>
											<div className='Description-Top'>
												<div className='This'>
													<div className='Description-type'>
														<span>
															<Moment fromNow>{state.jobs.created_at}</Moment>
														</span>
														<span className='Job-dot'>•</span>
														<span className='Job-type'>{state.jobs.type}</span>
													</div>

													<p className='Description-JobTitle'>
														{state.jobs.title}
													</p>
													<p className='Description-Location'>
														{state.jobs.location}
													</p>
												</div>
												<div className='button-an'>
													{applynow.length <= 1 ? (
														<a
															href={state.jobs.company_url}
															target='_blank'
															rel='noopener noreferrer'
														>
															Apply Now
														</a>
													) : (
														<a
															href={applynow}
															target='_blank'
															rel='noopener noreferrer'
														>
															Apply Now
														</a>
													)}
												</div>
											</div>

											<div
												className='content Description-bottom'
												dangerouslySetInnerHTML={{
													__html: state.jobs.description,
												}}
											></div>
										</div>
									</div>
									<div
										className='content how-to-apply'
										dangerouslySetInnerHTML={{
											__html: state.jobs.how_to_apply,
										}}
									></div>

									<div className='ApplyNow'>
										<div className='company-name company-dandt'>
											<p>{state.jobs.company}</p>
											<span>
												{!state.jobs.company_url
													? " "
													: state.jobs.company_url
															.replace("/", "")
															.replace("https:/", "")
															.replace("www.", "")
															.replace("www.", "")
															.replace("http:/", "")}
											</span>
										</div>
										<div className='button-an'>
											{applynow.length <= 1 ? (
												<a
													href={state.jobs.company_url}
													target='_blank'
													rel='noopener noreferrer'
												>
													Apply Now
												</a>
											) : (
												<a
													href={applynow}
													target='_blank'
													rel='noopener noreferrer'
												>
													Apply Now
												</a>
											)}
										</div>
									</div>
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</>
	);
};

export default JobDeatils;
