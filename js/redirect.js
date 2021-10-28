const PREFIX_LINK = "https://meet.google.com/";
const MEET_COMP = "Google";

const now = new Date();
const msg_box = document.getElementById("message");

const day = now.getDay(), hour = now.getHours(), mins = now.getMinutes();
function join() {
	if(!localStorage) {
		msg_box.innerHTML = "Your broser does not support this app.";
		return;
	}
	if(!localStorage.getItem("Batch")) {
		localStorage.setItem("Batch",prompt("This is one time setup.\nEnter your batch number.","1"));
	}
	if(!localStorage.getItem("authuser")) {
		localStorage.setItem("authuser",prompt("This is one time setup.\nEnter the serial number (index) of your college account on the list of all " + MEET_COMP + "accounts. (Leave 0 if on mobile device)","0"));
	}
	if(day == 0) {
		msg_box.innerHTML = "It's sunday!! Sleep &#128564";
		return;
	}
	else {
		Promise
			.all([
				fetch("../tt.json").then(res => res.json()),
				fetch("../courses.json").then(res => res.json())
			])
			.then(res => {
				let next_class_timing = 24;
				for(let i of res[0][day - 1]) {
					if(!i.Batch || i.Batch == localStorage.getItem("Batch")) {
						if(hour >= i.StartTime && hour - i.StartTime < i.Duration) {
							msg_box.innerHTML = "Joining lecture of " + i.CourseCode;
							location.href = PREFIX_LINK + res[1][i.CourseCode]["GMeetCode"] + "?authuser=" + localStorage.getItem("authuser");
							return;
						}
						if(hour < i.StartTime) {
							next_class_timing = Math.min(next_class_timing, i.StartTime);
						}
					}
				}
				msg_box.innerHTML = "No class scheduled for now!";
				if(next_class_timing == 24)
					msg_box.innerHTML += "<br>That's it for the day";
				else
					alert("Next class at " + next_class_timing + ":00.");
				return;
			});
	}
}

join();
