"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBlogPost = generateBlogPost;
var fs_1 = require("fs");
var path_1 = require("path");
// This function would ideally interact with an LLM to generate content
// For demonstration, we'll use a placeholder
function generateContent(topic) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // In a real scenario, this would be an API call to a content generation service
            // or an LLM.
            return [2 /*return*/, "\n# ".concat(topic, "\n\n## \uC11C\uB860\n").concat(topic, "\uC5D0 \uB300\uD55C \uD765\uBBF8\uB85C\uC6B4 \uB0B4\uC6A9\uC744 \uB2E4\uB8F0 \uAC83\uC785\uB2C8\uB2E4.\n\n## \uBCF8\uB860\n").concat(topic, "\uC740 \uC2A4\uD0A8\uCF00\uC5B4\uC5D0\uC11C \uB9E4\uC6B0 \uC911\uC694\uD569\uB2C8\uB2E4.\n\n### ").concat(topic, "\uC758 \uC911\uC694\uC131\n").concat(topic, "\uC740 \uD53C\uBD80 \uAC74\uAC15\uC5D0 \uD544\uC218\uC801\uC778 \uC5ED\uD560\uC744 \uD569\uB2C8\uB2E4.\n\n## \uACB0\uB860\n").concat(topic, "\uC5D0 \uB300\uD574 \uB354 \uC54C\uC544\uBCF4\uC138\uC694.\n")];
        });
    });
}
function slugify(text) {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^؀-ٰٟ-ٿڐ-ۏ۠-ۯۺ-ۿa-zA-Z0-9_-]/g, '')
        .replace(/--+/g, '-');
}
function generateBlogPost(topic, title) {
    return __awaiter(this, void 0, void 0, function () {
        var content, slug, date, frontMatter, markdownContent, filePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, generateContent(topic)];
                case 1:
                    content = _a.sent();
                    slug = slugify(title);
                    date = new Date().toISOString().split('T')[0];
                    frontMatter = "---\ntitle: '".concat(title, "'\ndate: '").concat(date, "'\n---\n");
                    markdownContent = "".concat(frontMatter, "\n").concat(content);
                    filePath = (0, path_1.join)(process.cwd(), 'posts', "".concat(slug, ".md"));
                    (0, fs_1.writeFileSync)(filePath, markdownContent, 'utf8');
                    console.log("Generated blog post: ".concat(filePath));
                    return [2 /*return*/];
            }
        });
    });
}
