import * as grpcWeb from "grpc-web";
import { JoinRequest, ChatMessage, SendReply } from "./chat_pb";

export class ChatClient {
  private client_: grpcWeb.GrpcWebClientBase;
  private hostname_: string;
  private credentials_: { [key: string]: string };
  private options_: { [key: string]: any };
  private methodDescriptorJoinChat: grpcWeb.MethodDescriptor<
    JoinRequest,
    ChatMessage
  >;
  private methodDescriptorSendMessage: grpcWeb.MethodDescriptor<
    ChatMessage,
    SendReply
  >;

  constructor(
    hostname: string,
    credentials?: { [key: string]: string },
    options?: { [key: string]: any }
  ) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options["format"] = "text";

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname.replace(/\/+$/, "");
    this.credentials_ = credentials;
    this.options_ = options;

    this.methodDescriptorJoinChat = new grpcWeb.MethodDescriptor(
      "/Chat/JoinChat",
      grpcWeb.MethodType.SERVER_STREAMING,
      JoinRequest,
      ChatMessage,
      (request) => request.serializeBinary(),
      ChatMessage.deserializeBinary
    );

    this.methodDescriptorSendMessage = new grpcWeb.MethodDescriptor(
      "/Chat/SendMessage",
      grpcWeb.MethodType.UNARY,
      ChatMessage,
      SendReply,
      (request) => request.serializeBinary(),
      SendReply.deserializeBinary
    );
  }

  // Server streaming
  joinChat(request: JoinRequest, metadata?: grpcWeb.Metadata) {
    return this.client_.serverStreaming(
      this.hostname_ + "/Chat/JoinChat",
      request,
      metadata || {},
      this.methodDescriptorJoinChat
    );
  }

  // Unary RPC (Promise or Callback)
  sendMessage(
    request: ChatMessage,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError, response: SendReply) => void
  ): Promise<SendReply> | grpcWeb.ClientReadableStream<SendReply> {
    if (callback) {
      // Callback style
      return this.client_.rpcCall(
        this.hostname_ + "/Chat/SendMessage",
        request,
        metadata || {},
        this.methodDescriptorSendMessage,
        callback
      );
    }

    // Promise style
    return new Promise<SendReply>((resolve, reject) => {
      this.client_.rpcCall(
        this.hostname_ + "/Chat/SendMessage",
        request,
        metadata || {},
        this.methodDescriptorSendMessage,
        (err, response) => {
          if (err) reject(err);
          else resolve(response);
        }
      );
    });
  }
}
