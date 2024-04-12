import PostService from "../src/domain/services/postService";
import { PostDTO } from "../src/dtos/postDTOs";

describe("Test Empty Posts Submission", () => {
  it("responds to postService", () => {
    const posts: PostDTO[] = [];
    const res = PostService.checkIfThereAreAnyValidPosts(posts);
    expect(res).toBe(false);
  });
});

describe("Test Empty Posts Submission 2", () => {
  it("responds to postService", () => {
    const posts: PostDTO[] = [
      {
        id: "",
        title: "",
        content: "",
        category: 0,
      },
    ];
    const res = PostService.checkIfThereAreAnyValidPosts(posts);
    expect(res).toBe(false);
  });
});

describe("Test Empty Posts Submission 3", () => {
  it("responds to postService", () => {
    const posts: PostDTO[] = [
      {
        id: "b554a93e-68b6-46f5-91e0-86e183f8dbc2",
        title: "",
        content: "",
        category: 0,
      },
    ];
    const res = PostService.checkIfThereAreAnyValidPosts(posts);
    expect(res).toBe(false);
  });
});

describe("Test Empty Posts Submission 4", () => {
  it("responds to postService", () => {
    const posts: PostDTO[] = [
      {
        id: "b554a93e-68b6-46f5-91e0-86e183f8dbc2",
        title: "melvin",
        content: "",
        category: 0,
      },
    ];
    const res = PostService.checkIfThereAreAnyValidPosts(posts);
    expect(res).toBe(false);
  });
});

describe("Test Empty Posts Submission 5", () => {
  it("responds to postService", () => {
    const posts: PostDTO[] = [
      {
        id: "b554a93e-68b6-46f5-91e0-86e183f8dbc2",
        title: "melvin",
        content: "nunes",
        category: 0,
      },
    ];
    const res = PostService.checkIfThereAreAnyValidPosts(posts);
    expect(res).toBe(false);
  });
});

describe("Test Valid Posts Array Submission", () => {
  it("responds to postService", () => {
    const posts: PostDTO[] = [
      {
        id: "b554a93e-68b6-46f5-91e0-86e183f8dbc2",
        title: "melvin",
        content: "nunes",
        category: 1,
      },
    ];
    const res = PostService.checkIfThereAreAnyValidPosts(posts);
    expect(res).toBe(true);
  });
});
