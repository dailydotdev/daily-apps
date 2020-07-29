import '../../icons/bookmark';
import '../../icons/menu';
import '../../icons/upvote';
import '../../icons/comment';
import '../../icons/arrow';
import commentPopupText from '../commentPopupText';

export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
    menuOpened: {
      type: Boolean,
      default: false,
    },
    showMenu: {
      type: Boolean,
      default: true,
    },
    bookmarksMenuOpened: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    showCommentPopup: {
      type: Boolean,
      default: false,
    },
    sendingComment: {
      type: Boolean,
      default: false,
    },
    comment: {
      type: String,
      default: null,
    },
  },

  data() {
    const r = Math.random();
    const selected = commentPopupText[Math.floor(r * commentPopupText.length)];

    return {
      notifying: false,
      notification: '',
      selectedComment: null,
      hasPostComment: false,
      commentPopupTitle: selected.title,
      commentPopupPlaceholder: selected.placeholder,
    };
  },

  methods: {
    notify(notification) {
      this.notification = notification;
      this.notifying = true;
      setTimeout(() => {
        this.notifying = false;
      }, 1000);
    },

    onPublicationClick() {
      this.$emit('publication', { pub: this.post.publication });
    },

    onLinkClick() {
      this.$emit('click', this.post);
    },

    onUpvoteClick() {
      this.$emit('upvote', { post: this.post, upvoted: !this.post.upvoted });
    },

    onCommentClick() {
      this.$emit('comment', this.post);
    },

    onBookmarkClick(event) {
      this.$emit('bookmark', { event, post: this.post, bookmarked: !this.post.bookmarked });
    },

    onMenuClick(event) {
      this.$emit('menu', { event, post: this.post });
    },

    onFeaturedCommentClick(comment) {
      this.selectedComment = comment;
    },

    onBackClick() {
      this.selectedComment = null;
    },

    onPostCommentClick() {
      this.$emit('comment', { post: this.post, comment: this.$refs.comment.value });
    },

    onCommentInput() {
      this.hasPostComment = !!this.$refs.comment.value.length;
    },
  },

  computed: {
    bookmarkTooltip() {
      return this.post.bookmarked ? 'Remove bookmark' : 'Bookmark';
    },

    comments() {
      return (this.post.featuredComments || []).slice(0, 3);
    },

    showComment() {
      return this.selectedComment !== null;
    },

    enablePostComment() {
      return !this.sendingComment && this.hasPostComment;
    },

    cls() {
      return {
        read: (this.post.read && !this.showComment) || this.showCommentPopup || this.notifying,
        bookmarked: this.post.bookmarked,
        hover: this.menuOpened || this.bookmarksMenuOpened || this.selected,
        disabled: this.showCommentPopup || this.notifying,
        'show-comment-popup': this.showCommentPopup,
      };
    },
  },

  mounted() {
    if (this.showCommentPopup && this.comment && this.comment.length) {
      const el = this.$el.querySelector('textarea');
      el.value = this.comment;
      el.dispatchEvent(new Event('input'));
    }
  },
};
