## FocusGuard
**Internal Technical Design & Development Guide**
Project Name: FocusGuard
Document Version: 0.1
Last Updated: [Date]
Maintained By: Product Owner / Scrum Team
Extention GitHub Link: https://github.com/CyleA25088/CSE-170-Clock-Extension

* * *
## Table of Contents

1. Project Overview 
2. Mission and Goals 
3. Core Features 
4. Project Structure 
5. Extension Design
6. Website Design 
7. Team Structure 
8. Development Workflow 
9. Data & Tracking Logic 
10. Notification & Distraction Detection 
11. User Experience Guidelines
12. Security & Privacy Considerations
13. Future Improvements
14. Troubleshooting & Developer Notes

* * *
## 15. Project Overview 

**Purpose**

FocusGuard is a browser extension designed to help users stay focused while studying or working.
The extension combines:
    • A *study timer* using the Pomodoro system and a regular countdown timer
    • *Distraction monitoring* via making sure you are on websites you are supposed to be on or aren’t on websites you aren't supposed to be on
    •*Idle detection* to make sure you are working consistently and not just stalling or getting distracted by outside sources by remaining inactive
    • *Focus reminders* to help remind you what you should be doing and keeping you on track
A supporting *website* will promote the extension and explain its functionality.

* * *
## 2. Mission and Goals

**Mission**

Help users stay focused and productive by detecting distractions, inaction, and reinforcing structured study sessions.

**Key Objectives**

    • Encourage productive study habits
    • Reduce time spent on distracting websites
    • Ensures consistent working when supposed to 
    • Maintain a simple and clean interface
	
**Success Criteria**

FocusGuard is successful if:
    • *The extension reliably detects distractions* – either from being inactive or on a website you’re not supposed to be on
    • *Timer functions operate correctly* – both the Pomodoro and countdown timers
    • *Notifications appear when expected* – when you’re inactive for too long, on a website you’re not supposed to be on, when the timer ends for the countdown timer, and when a new timer begins to tell you whether you should work or take a break for the Pomodoro timer
    • *The interface remains simple and intuitive* – is clearly understood and followed well

* * *
## 3. Core Features

## 3.1 Timer System

The extension will include a timer/alarm feature with two modes, a basic alarm, or a pomodoro alarm. The users will set the times within the extension. They will be able to switch between the pomodoro and regular timer from the extension.

**Standard Timer**

The standard timer will have a single time input of hours and minutes and a start button. It will count down for the set time and then notify/alarm the user when the time is complete. For example, the user may put in 1h 30m, push start, and after that time they should be notified that they can complete studying. A pause button would be helpful if it is easy to implement but not required.

**Pomodoro Mode**

The Pomodoro timer will have two times to set: the study time and the break time. The purpose of the pomodoro method is to give structure to studying for breaks. This keeps students accountable and rewards them for their work. For example, I could study for an hour, and when that time is complete, I get 20 minutes off. Once 20 minutes is over, I go back to an hour of study.
	The pomodoro timer is unique because it needs two times set and repeat. One time will be study time, which comes first. Second will be break time. At each switch, the user should be notified of the change. After the cycle is complete, it starts again. (After studying is a break, and after the break studying starts again.) This cycle will continue until the user turns it off.
The time input should be just like the regular timer, including minutes and hours. 

**Expected Functions**

*Include:*
    • Both timers should allow hours, minutes, or both
    • The timer needs both a start and stop function with an optional pause
    • The user should be able to switch between the regular and pomodoro timers.
    • The timer should not be required for other functions. 

## 3.2 Distraction Monitoring

FocusGuard should track when users visit specific websites considered distracting. There is no need to create a master list built in. It would never be all comprehensive. The user should be able to input the sites themselves. We would recommend the users put the allowed sites in, not the denied sites. This could also be referred to as a “fail closed” method.

*Example of Allowed sites:*
    • Canvas
    • Office 365
    • BYUI Dashboard
	
*What would be Blocked:*
    • Everything else
	
The extension would still function with a “black list” instead of “white list”. If there is extra time and it is desired, both could be added as well if there is extra time. 

**Expected Behavior**

*How to get sites:*
    • User opens extension
    • User pastes in the sites they will use (or not use)
    • User will start on their work
	
*When a distracting site is visited:*
    • The extension detects the site
    • A warning notification appears
    • The user is encouraged to return to work
	
*A small note:*
	When detecting sites, it is important to remember that there can be multiple locations within a domain, and often even multiple subdomains. When blocking sites if it is a perfect match system, students will run into errors and get frustrated. In other words, a student should be able to paste in “instructure.com” and be able to access “https://byui.instructure.com/” or “https://byui.instructure.com/courses/396326/grades” without any issues. They should also be able to paste in “https://byui.instructure.com/courses/396326/grades” and be able to access “https://byui.instructure.com/” or “https://awsacademy.instructure.com/” without any issues. Without this input sanitization, the extension will not work as intended. This is also a key part of the extension. Consider working with wild cards, improving user instruction, and “cleaning” user inputs. 

## 3.3 Idle Detection

The extension should monitor whether the browser becomes inactive. The amount could be set by the user or preset to a reasonable time. 

*Possible indicators:*
    • No keyboard activity
    • No mouse movement
    • Tab inactivity
	
*If inactivity exceeds a defined threshold:*
A notification should remind the user to resume work. Something to consider is that if they are on their phone and have put their computer to the side, they will not see the notification. If there is actually sound, they have a better chance of resuming their work.
It is also a good thing to remember that some users may not like this function for some or all tasks. It is a good idea to have, at the very least, this feature toggleable on or off. After this has been added, allowing the user to set the amount of time would be secondary and option user input. 

## 3.4 Back End Design

There are A few more issues worth mentioning that should be designed in from the beginning by the front and back-end teams. These come from AI and may have errors, but they need to be researched and likely implimented.

1. This extension will require specific permissions. These should be saved in something like a manifest.json file. This will allow us to request those specific permissions.
2. For this extension to save data, it will need to use chrome.storage.local. If it isn’t a pain to put in, this will allow they last used settings to repopulate.
3. Important Persistence Requirement:
        ◦ The timer must persist even if the popup is closed.
        ◦ This should be handled, according to AI, in background.js using alarms or intervals.
        ◦ If this is not implemented the data will all be lost if the popup is not kept open
        ◦ On this specific note, the popup js and background js should be different. The popup will send commands, the background will execute them, and you will also likely need a third to monitor and store website activity. This will require more communication between the extension teams, but will help significantly further down the line, and is industry standard.
   
* * *
## 4. Project Structure

FocusGuard is intended to be a browser extension. The reason for this is that browser extensions are not limited to one page. If a webpage was used, it could not see multiple tabs and their URLs or detect inactivity across all sites. The website is intended to promote the FocusGuard extension. 

**1. Browser Extension**

Handles all productivity features.

*Responsibilities:*
    • Timer logic
    • Website monitoring
    • Inactivity Monitoring
    • User notifications
    • Interface display
	
**2. Promotional Website**

*Responsibilities:*
    • Explain extension purpose
    • Provide download links
    • Showcase features
    • Convince users to download the extension

	
* * *
## 5. Extension Design

**Interface Components**

*Main popup interface includes:*
    • tabs
    • Pomodoro timer, and a regular timer display
    • Method to add 5 minutes to the timer
    • Start / pause / stop / reset / pin controls
    • Status messages
    • User task list
    • Settings
    • Whitelist / Blacklist UI
    • Theme switches
	
**Layout**
![5a4885ae359f138b195a2910d7c3e345.png](:/f7730def76044a98998e964a6ce52914)

**File Structure**

/CSE-170-Clock-Extension
│   manifest.json			# Extension configuration and permissions
│   background.js			# Service worker for timer logic & alarm management
│   warning.html			# Full-page block screen for blacklisted sites
│   warning_popup.html		# Small alert overlay
│   guide.md				# Documentation for internal use
│
├───icons/				# Visual assets for the Chrome toolbar
│       icon16.png
│       icon48.png
│       icon128.png
│
├───content/				# Scripts that run on web pages
│       content.js			# Handles site blocking and DOM manipulation
│
└───popup/				# Main User Interface
    │   popup.html			# Shell container with navigation tabs
    │   popup.js				# Controller for tab switching and UI updates
    │   popup.css			# Global styles for the extension interface
    │
    └───pages/				# Modular views (loaded into popup.html)
            pomodoro.html		# Pomodoro-specific controls and status
            timer.html			# Standard countdown/stopwatch interface
            settings.html			# Blacklist UI and Theme switches
			
Developers should keep the structure organized and clearly documented.

* * *
## 6. Website Design 

The website serves as the *public face of FocusGuard.*

**Website Goals**
    • Explain what FocusGuard does
    • Encourage installation
    • Demonstrate benefits
	
**Sections**
- Introduction
- Download
- Features
- How It Works
- Team / About

**Design**
The design of the website should be cool and sleek; evocative of technology and focus.
![b9dddb85e9947890ee1f70e5d9e80f14.png](:/6f63c7db1f744c5180c76a52fcef61d5)
![c993f8a10262155e219212007607b4d7.png](:/abc100c04e2f42db94a400ba503e216d)

* * *
## 7. Team Structure 

The project is divided into four teams.

**1. Website Team**
The website team is responsible for creating the website where people can download the Focus Guard extension onto their device. It should be easy to navigate and be visually appealing .  It should also have  information on what the extension is and why people should download it. 


**2. Front End Team (Extension UI)**
The front-end team is responsible for making sure the extension is easy for people to use and interact with.  It should be a priority to make a smooth user experience so that interactions are straightforward. The popup interface should be simple and not cluttered. They are also responsable for the creation of the extension. 

**3. Functionality Team (Logic / Systems)**
The functionality team should ensure the extension is working reliably to accurately detect when the user is distracted or in a period of inactivity. This team should also make sure to have well-timed notifications to keep the users informed without being very intrusive and interrupting. 

**4. Product Owner & Scrum Team**
The scrum team is in charge of communication between each group so that we all stay aligned and informed as we make this extension.  They are in charge of keeping the project on task by keeping track of the progress each group has made. Additionally, this team should help whenever a team is having some kind of blocker. They should also make sure each component of the project is coming together as planned and that they will be able to all coordinate together.

* * *
## 8. Development Workflow 

**Tools**
    • Git / GitHub / VS code
    • Browser developer tools
    • MS Teams
	
**Development Strategy**

The main repository hosts the content of the exertion and where everything will be officially stored for the extension. When developers are contributing to this branch, they must first setup their own fork of the repository and then work on that on their own profile. When it comes time to push to the main repository, they will create a pull request comparing their fork and the main one, and the team leaders will either accept or deny the pull request. This method is to make sure there are no conflicts with the files being pushed.

* * *
## 9. Data & Tracking Logic 

**Site Tracking**

FocusGuard must detect when the user visits specific domains.

*Example logic:*
    • Listen for tab updates
    • Compare URL against distraction list
    • Compare URL against allowed list
    • Trigger warning if matched
	
*It should:*
    • Function with both whitelist (only listed sites are allowed) and, if possible, blacklist (listed sites are not allowed) modes
    • Store whitelist and blacklist items
    • Store last used timer settings
	
*Example domains:*

Whitelist:
-instructure.com
-sharepoint.com

Blacklist:
-tiktok.com
-twitter.com

*Please read the note at the end of 3.2 for further information about the logic. It contains information about sanitizing, fail cases, UI preference.*

* * *
## 10. Notification System

*Notifications may appear when:*
    • A distracting site is opened
    • The user becomes inactive for too long
    • A focus session ends (on focus mode)
    • The timer ends (on timer mode)
	
*Notifications should:*
    • Be brief
    • Be encouraging rather than annoying
    • Avoid excessive repetition
    • Be easy to dismiss

* * *
## 11. User Experience Guidelines

*FocusGuard should feel:*
    • Simple
    • Non-intrusive
    • Helpful rather than punitive
	
*UX Principles:*
    • Minimal interface
    • Clear status indicators
    • Easy controls
    • Consistent behavior

* * *
## 12. Security & Privacy Considerations

Since FocusGuard observes browsing activity, privacy must be respected.

*Guidelines:*
    • Do not store unnecessary browsing data
    • Avoid collecting personal information
    • Be transparent about tracking behavior

* * *
## 13. Future Improvements

*Possible future features:*
    • Focus statistics
    • Study streak tracking
    • Other study features
    • Monitorial system
    • Productivity dashboards
    • Mobile companion app
    • Cross Device Funtion
    • Virtual Pet

* * *
## 14. Troubleshooting & Developer Notes
*Website:*


*Extension:*


*Known Bugs:*