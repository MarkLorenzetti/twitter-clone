import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const tweetInput = document.getElementById("tweet-input")
const tweetBtn = document.getElementById("tweet-btn")

tweetInput.addEventListener('input', function(){
    
    if(tweetInput.value.length >= 1){
        tweetBtn.disabled = false
        tweetBtn.classList.remove("disabled-btn")
    } else {
        tweetBtn.disabled = true
        tweetBtn.classList.add("disabled-btn")
    }
})


document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.id === 'delete'){
        deleteTweet(e.target.dataset.eliminate)
    }
    else if(e.target.id === 'reply-btn'){
         HandleAddReply(e.target.dataset.answer)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
    //get all the replay button
    const replyBtns = document.querySelectorAll("#reply-btn")
    //for each button retrive the relative input
    replyBtns.forEach(function(btn){      
        const replyInput = document.getElementById(`reply-${btn.dataset.answer}`)
        replyInput.addEventListener("input", function(){
            //focus on the button selected
            if(btn.dataset.answer === replyId){
                if(replyInput.value.length >= 1){
                    btn.disabled = false
                    btn.classList.remove("disabled-btn")
                } else {
                    btn.disabled = true
                    btn.classList.add("disabled-btn")
                }
            }
        })
    })
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')
    if(tweetInput.value !== '') {           
            tweetsData.unshift({
                handle: `@unknown user`,
                profilePic: `images/unknown-user.png`,
                likes: 0,
                retweets: 0,
                tweetText: tweetInput.value,
                replies: [],
                isLiked: false,
                isRetweeted: false,
                uuid: uuidv4()
            })
        render()
        tweetInput.value = ''
        }
    }

function deleteTweet(TweetId){
    //get the index of every object
    const targetTweetObj = tweetsData.findIndex(function(tweet){
        //return the index of that one to be deleted
        if(tweet.uuid === TweetId){
            return tweet
        }
    })
    tweetsData.splice(targetTweetObj, 1);
    render()
}

function HandleAddReply(tweetId){
    const replyInput = document.getElementById(`reply-${tweetId}`)    
    if(replyInput){
        //retrieve the right tweet in which the reply is to be inserted
        tweetsData.forEach(function(tweet){
            if(tweet.uuid === tweetId){
                //new tweet object
                tweet.replies.push(
                    {
                        handle: `@Unknown user`,
                        profilePic: `images/unknown-user.png`,
                        likes: 0,
                        retweets: 0,
                        tweetText: replyInput.value,
                        replies: [],
                        isLiked: false,
                        isRetweeted: false,
                        uuid: uuidv4()
                    } //end of the new object
                ) // end of the unshift function
            } //end of the conditional
        }) //end of the for loop
    } //end of the input conditional handler
    render()
    //set back the reply buttons to the default status
    handleReplyClick(tweetId)
    //keep the replies open to display the new reply
    document.getElementById(`replies-${tweetId}`).classList.remove("hidden")
    

}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                    <div class="tweet-reply">
                        <div class="tweet-inner">
                            <img src="${reply.profilePic}" class="profile-pic">
                                <div>
                                    <p class="handle">${reply.handle}</p>
                                    <p class="tweet-text">${reply.tweetText}</p>
                                </div>
                            </div>
                    </div>
                `
            })
        }
        
        feedHtml += `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots"
                                data-reply="${tweet.uuid}"
                                ></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likeIconClass}"
                                data-like="${tweet.uuid}"
                                ></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetIconClass}"
                                data-retweet="${tweet.uuid}"
                                ></i>
                                ${tweet.retweets}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-sharp fa-solid fa-trash" data-eliminate="${tweet.uuid}" id="delete"></i>
                            </span>
                        </div>   
                    </div>            
                </div>
                <div class="hidden" id="replies-${tweet.uuid}">
                    ${repliesHtml}
                    <div class="reply-answer-container">
                        <div class="tweet-input-area">
                            <img src="images/unknown-user.png" class="profile-pic">
                            <textarea class="reply-text-area" placeholder="reply to ${tweet.handle}" id="reply-${tweet.uuid}"></textarea>
                        </div>
                        <button class="reply-button disabled-btn" data-answer="${tweet.uuid}" id="reply-btn" disabled>reply</button>
                    </div>
                </div>   
            </div>
        `
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

