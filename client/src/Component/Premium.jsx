import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setFree } from "../utils/Slices/freeTrialSlice";

const Premium = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleBrowse = () => {
        dispatch(setFree(true));
        navigate("/edit-and-view-Or-View-Only");
    }
    return (
        <>
            <button className=" absolute left-0 mt-2 ml-2 font-bold border border-amber-500 shadow-sm shadow-amber-400 px-3 py-1 rounded-md cursor-pointer text-sm active:bg-blue-400 active:text-white active:shadow-none " onClick={() => navigate("/edit-and-view-Or-View-Only")}>Back</button>
            <div className="mt-10">
                <h1>Simple pricing, no hidden fees.</h1>
            </div>
            <div className="my-10 mx-14 md:mx-10 flex flex-wrap gap-x-4 gap-y-4 justify-center">

                <div className="bg-white border border-gray-300 flex flex-col items-start my-6 py-10 px-8 sm:w-full sm:mx-10 md:mx-0 md:w-[400px] rounded-md ">
                    <div className="text-green-700 font-bold text-3xl mb-6">Free</div>
                    <div className="flex text-start text-gray-600 mb-8 text-sm">All the Components that are freely available on the website are free to use.</div>

                    <div className="mb-6">
                        <span className="font-bold text-2xl">$0</span> <span className="text-gray-500 text-sm">/month</span>
                    </div>
                    <div className="text-gray-600 text-sm flex flex-col gap-y-4">
                        <div className="flex text-start gap-x-2">
                            <div>✅</div>
                            <div>A growing library of awesome components A growing library of awesome components</div>
                        </div>
                        <div className="flex text-start gap-x-2">
                            <div>✅</div>
                            <div>A growing library of awesome components</div>
                        </div>
                        <div className="flex text-start gap-x-2">
                            <div>✅</div>
                            <div>A growing library of awesome components</div>
                        </div>
                        <div className="flex text-start gap-x-2">
                            <div>✅</div>
                            <div>A growing library of awesome components</div>
                        </div>
                        <div className="flex text-start gap-x-2">
                            <div>✅</div>
                            <div>A growing library of awesome components</div>
                        </div>
                        
                    </div>
                    <button className="border border-green-700 w-full mt-10 rounded-md py-2 text-green-700 font-bold active:bg-green-600 active:text-white" onClick={handleBrowse}>Browse</button>

                    <div className="text-start mt-8 text-sm">
                        <p><span className="text-gray-600">Questions?</span><span className="text-green-700 font-semibold ml-1">Chat with us.</span></p>
                        <p><span className="text-gray-600">or email at</span> <span className="text-green-700 font-semibold ml-1">agritechies.piet@gmail.com</span></p>
                    </div>
                </div>

                <div className="bg-white border border-gray-300 flex flex-col items-start my-6 py-10 px-8 sm:w-full sm:mx-10 md:mx-0 md:w-[400px] rounded-md">
                <div className="text-green-700 font-bold text-3xl mb-6">Pro</div>
                    <div className="flex text-start text-gray-600 mb-8 text-sm">All the Components that are freely available on the website are free to use.</div>

                    <div className="mb-6">
                        <span className="font-bold text-2xl">$99</span> <span className="text-gray-500 text-sm">/month</span>
                    </div>

                    <div className="text-gray-600 text-sm flex flex-col gap-y-4">
                        <div className="flex text-start gap-x-2">
                            <div>✅</div>
                            <div>A growing library of awesome components A growing library of awesome components</div>
                        </div>
                        <div className="flex text-start gap-x-2">
                            <div>✅</div>
                            <div>A growing library of awesome components</div>
                        </div>
                        <div className="flex text-start gap-x-2">
                            <div>✅</div>
                            <div>A growing library of awesome components</div>
                        </div>
                        <div className="flex text-start gap-x-2">
                            <div>✅</div>
                            <div>A growing library of awesome components</div>
                        </div>
                        <div className="flex text-start gap-x-2">
                            <div>✅</div>
                            <div>A growing library of awesome components</div>
                        </div>
                        
                    </div>
                    <button className="border border-green-700 w-full mt-10 rounded-md py-2 text-green-700 font-bold active:bg-green-600 active:text-white">Buy Now</button>

                    <div className="text-start mt-8 text-sm">
                        <p><span className="text-gray-600">Questions?</span><span className="text-green-700 font-semibold ml-1">Chat with us.</span></p>
                        <p><span className="text-gray-600">or email at</span> <span className="text-green-700 font-semibold ml-1">agritechies.piet@gmail.com</span></p>
                    </div>
                </div>

                <div className="bg-blue-300 border border-gray-300 flex flex-col items-start my-6 py-10 px-8 sm:w-full sm:mx-10 md:mx-0 md:w-[400px] rounded-md">
                    <div className="text-green-700 font-bold text-3xl mb-6">Enterprise</div>
                    <div className="flex text-start text-gray-600 mb-8 text-sm">All the Components that are freely available on the website are free to use.</div>

                    <div className="mb-8 font-bold text-2xl">Let's Talk
                    </div>

                    <div className="text-gray-600 text-sm flex flex-col gap-y-4">
                        <div className="flex text-start gap-x-2">
                            <div>✅</div>
                            <div>A growing library of awesome components A growing library of awesome components</div>
                        </div>
                        <div className="flex text-start gap-x-2">
                            <div>✅</div>
                            <div>A growing library of awesome components</div>
                        </div>
                        <div className="flex text-start gap-x-2">
                            <div>✅</div>
                            <div>A growing library of awesome components</div>
                        </div>
                        <div className="flex text-start gap-x-2">
                            <div>✅</div>
                            <div>A growing library of awesome components</div>
                        </div>
                        <div className="flex text-start gap-x-2">
                            <div>✅</div>
                            <div>A growing library of awesome components</div>
                        </div>
                        
                    </div>
                    <button className="border border-green-700 w-full mt-10 rounded-md py-2 text-green-700 font-bold active:bg-green-600 active:text-white">Contact Us</button>

                    <div className="text-start mt-8 text-sm">
                        <p><span className="text-gray-600">Questions?</span><span className="text-green-700 font-semibold ml-1">Chat with us.</span></p>
                        <p><span className="text-gray-600">or email at</span> <span className="text-green-700 font-semibold ml-1">agritechies.piet@gmail.com</span></p>
                    </div>
                </div>

            </div>
        </>
    )
}
export default Premium;