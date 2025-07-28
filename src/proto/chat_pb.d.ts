import * as jspb from "google-protobuf";

export class JoinRequest extends jspb.Message {
  getUsername(): string;
  setUsername(value: string): JoinRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JoinRequest.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: JoinRequest
  ): JoinRequest.AsObject;
  static serializeBinaryToWriter(
    message: JoinRequest,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): JoinRequest;
  static deserializeBinaryFromReader(
    message: JoinRequest,
    reader: jspb.BinaryReader
  ): JoinRequest;
}

export namespace JoinRequest {
  export type AsObject = {
    username: string;
  };
}

export class ChatMessage extends jspb.Message {
  getUser(): string;
  setUser(value: string): ChatMessage;

  getText(): string;
  setText(value: string): ChatMessage;

  getTimestamp(): string;
  setTimestamp(value: string): ChatMessage;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatMessage.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: ChatMessage
  ): ChatMessage.AsObject;
  static serializeBinaryToWriter(
    message: ChatMessage,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): ChatMessage;
  static deserializeBinaryFromReader(
    message: ChatMessage,
    reader: jspb.BinaryReader
  ): ChatMessage;
}

export namespace ChatMessage {
  export type AsObject = {
    user: string;
    text: string;
    timestamp: string;
  };
}

export class SendReply extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): SendReply;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SendReply.AsObject;
  static toObject(includeInstance: boolean, msg: SendReply): SendReply.AsObject;
  static serializeBinaryToWriter(
    message: SendReply,
    writer: jspb.BinaryWriter
  ): void;
  static deserializeBinary(bytes: Uint8Array): SendReply;
  static deserializeBinaryFromReader(
    message: SendReply,
    reader: jspb.BinaryReader
  ): SendReply;
}

export namespace SendReply {
  export type AsObject = {
    success: boolean;
  };
}
