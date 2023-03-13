const title = {
    Background: [{sprite: "./sprites/title/titleBackground.png", x:0,y:0}]
}

const level = {
    Music: ["./sound/music/backgroundMusic.mp4"],
    // Ground: [{sprite: "./sprites/ground/ground30.png", x:0,y:0,size:50}],
    Player: [{x:500, y:500}],
    Ground: [{sprite: "./sprites/ground/background.png", x:0, y:0}],
    Fence: [
        // left side
        {x:0, y:0, state: 1},
        {x:0, y:1, state: 4},
        {x:0, y:2, state: 4},
        {x:0, y:3, state: 4},
        {x:0, y:4, state: 4},
        {x:0, y:5, state: 4},
        {x:0, y:6, state: 4},
        {x:0, y:7, state: 4},
        {x:0, y:8, state: 4},
        {x:0, y:9, state: 4},
        {x:0, y:10, state: 4},
        {x:0, y:11, state: 4},
        {x:0, y:12, state: 4},
        {x:0, y:13, state: 4},
        {x:0, y:14, state: 4},
        {x:0, y:15, state: 4},
        {x:0, y:16, state: 4},
        {x:0, y:17, state: 4},
        {x:0, y:18, state: 4},
        {x:0, y:19, state: 4},
        {x:0, y:20, state: 4},
        {x:0, y:21, state: 4},
        {x:0, y:22, state: 4},
        {x:0, y:23, state: 4},
        {x:0, y:24, state: 4},
        {x:0, y:25, state: 4},
        {x:0, y:26, state: 4},
        {x:0, y:27, state: 4},
        {x:0, y:28, state: 4},
        {x:0, y:29, state: 4},
        {x:0, y:30, state: 4},
        {x:0, y:31, state: 4},
        {x:0, y:32, state: 4},
        {x:0, y:33, state: 4},
        {x:0, y:34, state: 4},
        {x:0, y:35, state: 4},
        {x:0, y:36, state: 4},
        {x:0, y:37, state: 4},
        {x:0, y:38, state: 4},
        {x:0, y:39, state: 4},
        {x:0, y:40, state: 4},
        {x:0, y:41, state: 4},
        {x:0, y:42, state: 4},
        {x:0, y:43, state: 4},
        {x:0, y:44, state: 4},
        {x:0, y:45, state: 4},
        {x:0, y:46, state: 4},
        {x:0, y:47, state: 4},
        {x:0, y:48, state: 4},
        {x:0, y:49, state: 4},
        {x:0, y:50, state: 4},
        {x:0, y:51, state: 4},
        {x:0, y:52, state: 4},
        {x:0, y:53, state: 4},
        {x:0, y:54, state: 4},
        {x:0, y:55, state: 4},
        {x:0, y:56, state: 4},
        {x:0, y:57, state: 4},
        {x:0, y:58, state: 4},
        {x:0, y:59, state: 4},
        {x:0, y:60, state: 4},
        {x:0, y:61, state: 4},
        {x:0, y:62, state: 4},
        {x:0, y:63, state: 9},

        // top side
        {x:1, y:0, state: 14},
        {x:2, y:0, state: 14},
        {x:3, y:0, state: 14},
        {x:4, y:0, state: 14},
        {x:5, y:0, state: 14},
        {x:6, y:0, state: 14},
        {x:7, y:0, state: 14},
        {x:8, y:0, state: 14},
        {x:9, y:0, state: 14},
        {x:10, y:0, state: 14},
        {x:11, y:0, state: 14},
        {x:12, y:0, state: 14},
        {x:13, y:0, state: 14},
        {x:14, y:0, state: 14},
        {x:15, y:0, state: 14},
        {x:16, y:0, state: 14},
        {x:17, y:0, state: 14},
        {x:18, y:0, state: 14},
        {x:19, y:0, state: 14},
        {x:20, y:0, state: 14},
        {x:21, y:0, state: 14},
        {x:22, y:0, state: 14},
        {x:23, y:0, state: 14},
        {x:24, y:0, state: 14},
        {x:25, y:0, state: 14},
        {x:26, y:0, state: 14},
        {x:27, y:0, state: 14},
        {x:28, y:0, state: 14},
        {x:29, y:0, state: 14},
        {x:30, y:0, state: 14},
        {x:31, y:0, state: 14},
        {x:32, y:0, state: 14},
        {x:33, y:0, state: 14},
        {x:34, y:0, state: 14},
        {x:35, y:0, state: 14},
        {x:36, y:0, state: 14},
        {x:37, y:0, state: 14},
        {x:38, y:0, state: 14},
        {x:39, y:0, state: 14},
        {x:40, y:0, state: 14},
        {x:41, y:0, state: 14},
        {x:42, y:0, state: 14},
        {x:43, y:0, state: 14},
        {x:44, y:0, state: 14},
        {x:45, y:0, state: 14},
        {x:46, y:0, state: 14},
        {x:47, y:0, state: 14},
        {x:48, y:0, state: 14},
        {x:49, y:0, state: 14},
        {x:50, y:0, state: 14},
        {x:51, y:0, state: 14},
        {x:52, y:0, state: 14},
        {x:53, y:0, state: 14},
        {x:54, y:0, state: 14},
        {x:55, y:0, state: 14},
        {x:56, y:0, state: 14},
        {x:57, y:0, state: 14},
        {x:58, y:0, state: 14},
        {x:59, y:0, state: 14},
        {x:60, y:0, state: 14},
        {x:61, y:0, state: 14},
        {x:62, y:0, state: 14},
        {x:63, y:0, state: 3},

        // bottom side
        {x:1, y:63, state: 14},
        {x:2, y:63, state: 14},
        {x:3, y:63, state: 14},
        {x:4, y:63, state: 14},
        {x:5, y:63, state: 14},
        {x:6, y:63, state: 14},
        {x:7, y:63, state: 14},
        {x:8, y:63, state: 14},
        {x:9, y:63, state: 14},
        {x:10, y:63, state: 14},
        {x:11, y:63, state: 14},
        {x:12, y:63, state: 14},
        {x:13, y:63, state: 14},
        {x:14, y:63, state: 14},
        {x:15, y:63, state: 14},
        {x:16, y:63, state: 14},
        {x:17, y:63, state: 14},
        {x:18, y:63, state: 14},
        {x:19, y:63, state: 14},
        {x:20, y:63, state: 14},
        {x:21, y:63, state: 14},
        {x:22, y:63, state: 14},
        {x:23, y:63, state: 14},
        {x:24, y:63, state: 14},
        {x:25, y:63, state: 14},
        {x:26, y:63, state: 14},
        {x:27, y:63, state: 14},
        {x:28, y:63, state: 14},
        {x:29, y:63, state: 14},
        {x:30, y:63, state: 14},
        {x:31, y:63, state: 14},
        {x:32, y:63, state: 14},
        {x:33, y:63, state: 14},
        {x:34, y:63, state: 14},
        {x:35, y:63, state: 14},
        {x:36, y:63, state: 14},
        {x:37, y:63, state: 14},
        {x:38, y:63, state: 14},
        {x:39, y:63, state: 14},
        {x:40, y:63, state: 14},
        {x:41, y:63, state: 14},
        {x:42, y:63, state: 14},
        {x:43, y:63, state: 14},
        {x:44, y:63, state: 14},
        {x:45, y:63, state: 14},
        {x:46, y:63, state: 14},
        {x:47, y:63, state: 14},
        {x:48, y:63, state: 14},
        {x:49, y:63, state: 14},
        {x:50, y:63, state: 14},
        {x:51, y:63, state: 14},
        {x:52, y:63, state: 14},
        {x:53, y:63, state: 14},
        {x:54, y:63, state: 14},
        {x:55, y:63, state: 14},
        {x:56, y:63, state: 14},
        {x:57, y:63, state: 14},
        {x:58, y:63, state: 14},
        {x:59, y:63, state: 14},
        {x:60, y:63, state: 14},
        {x:61, y:63, state: 14},
        {x:62, y:63, state: 14},
        {x:63, y:63, state: 11},

        // right side
        {x:63, y:1, state: 4},
        {x:63, y:2, state: 4},
        {x:63, y:3, state: 4},
        {x:63, y:4, state: 4},
        {x:63, y:5, state: 4},
        {x:63, y:6, state: 4},
        {x:63, y:7, state: 4},
        {x:63, y:8, state: 4},
        {x:63, y:9, state: 4},
        {x:63, y:10, state: 4},
        {x:63, y:11, state: 4},
        {x:63, y:12, state: 4},
        {x:63, y:13, state: 4},
        {x:63, y:14, state: 4},
        {x:63, y:15, state: 4},
        {x:63, y:16, state: 4},
        {x:63, y:17, state: 4},
        {x:63, y:18, state: 4},
        {x:63, y:19, state: 4},
        {x:63, y:20, state: 4},
        {x:63, y:21, state: 4},
        {x:63, y:22, state: 4},
        {x:63, y:23, state: 4},
        {x:63, y:24, state: 4},
        {x:63, y:25, state: 4},
        {x:63, y:26, state: 4},
        {x:63, y:27, state: 4},
        {x:63, y:28, state: 4},
        {x:63, y:29, state: 4},
        {x:63, y:30, state: 4},
        {x:63, y:31, state: 4},
        {x:63, y:32, state: 4},
        {x:63, y:33, state: 4},
        {x:63, y:34, state: 4},
        {x:63, y:35, state: 4},
        {x:63, y:36, state: 4},
        {x:63, y:37, state: 4},
        {x:63, y:38, state: 4},
        {x:63, y:39, state: 4},
        {x:63, y:40, state: 4},
        {x:63, y:41, state: 4},
        {x:63, y:42, state: 4},
        {x:63, y:43, state: 4},
        {x:63, y:44, state: 4},
        {x:63, y:45, state: 4},
        {x:63, y:46, state: 4},
        {x:63, y:47, state: 4},
        {x:63, y:48, state: 4},
        {x:63, y:49, state: 4},
        {x:63, y:50, state: 4},
        {x:63, y:51, state: 4},
        {x:63, y:52, state: 4},
        {x:63, y:53, state: 4},
        {x:63, y:54, state: 4},
        {x:63, y:55, state: 4},
        {x:63, y:56, state: 4},
        {x:63, y:57, state: 4},
        {x:63, y:58, state: 4},
        {x:63, y:59, state: 4},
        {x:63, y:60, state: 4},
        {x:63, y:61, state: 4},
        {x:63, y:62, state: 4},
        
    ]
}