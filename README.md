## Group Avatar Halos

### 👩‍💻 Overview
A  Discourse theme component that adds a coloured halo around user avatars according to their primary groups or trust levels. The halo will appear around the user's avatar in all posts in topics, their user card and profile. The halos do not appear in topic lists, user directory or profile post list pages.

There are object settings to allow admins to specify the group or trust level halo color, avatar halo size and halo transparency.  

### ⚙️ Settings:

| Property | Description |
|----------|-------------|
| **Group** | Primary group or Trust Level to show the user avatar halo |
| **Halo Color** | Color of the topic author halo, can use Discourse color vars (best for dark/light mode compatibility, e.g.: `var(--tertiary)`), hex color codes, or html color names |
| **Halo Size** | Size of halo (small, medium or large) |
| **Halo Transparency** | Halo transparency (0.25 = 25%, 0.5 = 50%, 0.75 = 75%, 1.0 = 100%) |

For group hierarchy of halos: `Moderator > Admin > Primary Groups > Trust Level`.  Thus if a user is an admin, moderator, and member of primary group and trust level and all those groups have halos set, the moderator halo will be the one that displays.


### :camera_flash: Screenshot:

In the following screenshot, users HelloKitty, Catra and Lilly are all members of primary group `Pink`, but Lilly and Catra have admin and moderator halos respectively, which override the primary group. Also, HelloKitty and MsMarvel are both Trust Level 2, but HelloKitty's primary group halo overrides the Trust Level halo. 

<img width="90%" height="90%" alt="image" src="https://github.com/user-attachments/assets/5cccd6e0-9a52-44ec-95d6-650b5dd8eeca" />

<img width="90%" height="90%" alt="image" src="https://github.com/user-attachments/assets/1667a428-b33f-457a-aa0e-35ab38a9d781" />
