# **App Name**: ChronoBoard

## Core Features:

- Bell Schedule Display: Display the bell schedule with lesson times and a visual timer.
- Information Board Content: Display dynamic information, including text and images, via grouped layouts or a slider.
- Secure Admin Access: Admin access via secure PIN to manage content and schedules.
- Schedule Management: Admin function to adjust bell ringing schedules and times.
- Content Management: Admin function to add, delete, and edit information on the board.
- Customizable Board Appearance: Admin feature to customize the board's colors.
- Bell Sound Customization: Admin feature to add customize bell sound.

## Super Admin Panel:

- A separate, higher-level admin panel with its own codebase.
- This panel will be used to manage a list of schools.
- The super admin can add, edit, and delete schools.

## School Management:

- Each school will have its own individual settings.
- The super admin can manage the following for each school:
    - Design (colors)
    - Name
    - Logo
    - Class schedule
    - Bell settings
    - Information board content
- All school information will be fully editable after creation.

## Board Refresh:

- Both admin panels will have the ability to refresh the school “boards”.
- The admin can choose the refresh interval (e.g., 5, 10, or 20 minutes).

## Data Synchronization:

- Time calculations will not rely on the device’s system time.
- Time will be synchronized via the internet to ensure accuracy.

## Style Guidelines:

- Primary color: Deep indigo (#4B0082) to evoke trust and concentration.
- Background color: Light lavender (#E6E6FA), a desaturated tint of indigo.
- Accent color: Electric violet (#8F00FF), a brighter hue analogous to indigo.
- Headline font: 'Space Grotesk' sans-serif for a modern, techy look. Body font: 'Inter' sans-serif.
- Use simple, clear icons, especially a bell-shaped icon for bell ringing times.
- Bell schedule on the side (30-40% of screen) and information board content in the remaining space.
- Subtle transitions for content changes on the information board, potentially using a slider effect.
